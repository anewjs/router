# Anew Router

> A lightweight React Router framework
> Use [react-navigation](https://reactnavigation.org/) for react native routes.

The routes utility uses `react-router-dom` and `react-router-config` to define application routes. The utility adopts a cascading syntax (method chaining) to build the config passed to `react-router-config`.

## Table of Contents

-   [Installation](#installation)
-   [Creating Routes](#creating-routes)
-   [Rendering Routes](#rendering-routes)
-   [Router Components](#router-components)
-   [Router Utilities](#router-utilities)

## Installation

To install `anew` directly into your project run:

```
npm i @anew/router -S
```

for yarn users, run:

```
yarn add @anew/router
```

## Create Routes

```jsx
import Router from '@anew/router'

Router.use({
    // Config
    history: createHashHistory(),
    basename: '/my-app',

    // Top Level Props
    component: EntryComponent,
    routes: [
        {
            // HomeComponent will be rendered if the current path matches
            // the define path.
            path: '/home',

            // Assign a name to a route to easily access its properties
            // along with other AnewRouter actions. This allows for more
            // scalable routing since changing route props such as the path
            // will not require a refactor if the name is used. Also,
            // it makes it easier to call a route that has a long path.
            name: 'home',
            component: HomeComponent,
        },
        {
            path: '/about',

            // Optionally use Route render method instead of component
            render: () => <h1>About</h1>,
        },
        {
            path: '/contact',
            component: ContactComponent,

            // Pass Route props as documented in react-router package
            exact: true,
            strict: true,
        },
        {
            // Define arguments in the path
            // The :member argument is made optional with the `?` symbol
            // Both `/members/1` and `/member/` will render the route
            path: '/members/:member?',
            component: MembersComponent,

            // Define custom props
            // ex.
            // Useful when creating a sidebar component to only
            // render routes that have the `showInSidebar` flag.
            showInSidebar: true,
        },
        {
            // The router will redirect to the `home` route
            // when the path matches.
            path: '/',
            redirectTo: 'home'
        },
    ],
})
```

## Rendering Routes

```jsx
/**
 | ------------------
 | Components
 | ------------------
 */

class AppEntry extends React.Component {
    render() {
        const { RouterView } = this.props

        return (
            <div className="container">
                <Navbar />
                <div className="body">
                {
                    RouterView({
                        // Pass custom props
                        // to all child route components
                        someProp: 'someValue'
                    })
                }
                </div>
                <Footer />
            </div>
        )
    }
}

class AppTemplate extends React.Component {
    render() {
        const {
            // Prop passed from parent route
            // in AppEntry Component
            someProp,

            // Props passed from AnewRouter
            route,
            RouterView,
            location: { pathname },
        } = this.props

        return (
            <div className="container">
                <div>Applications</div>
                <Sidebar>
                {
                    route.routes.map(route => (
                        <Sidebar.Item active={route.action.is(pathname)}>
                            {captialize(route.name)}
                        </Sidebar.Item>
                    ))
                }
                </Sidebar>
                <div className="body">{RouterView()}</div>
                <button>Action</button>
            </div>
        )
    }
}

/**
 | ------------------
 | Routes
 | ------------------
 */

Router.use({
    component: AppEntry,
    routes: [
        {
            path: '/home',
            component: HomeComponent,
        },
        {
            path: '/about',
            component: AboutComponent,
        },
        {
            path: '/app',
            component: AppTemplate,
            routes: [
                {
                    path: '/todo',
                    component: ToDoComponent,
                },
                {
                    path: '/calculator',
                    component: CalculatorComponent,
                },
            ],
        },
    ]
})

/**
 | ---------------------
 | Mount
 | ---------------------
 */

import Anew from '@anew/anew'

Anew.use(Router)
    .render('#root')

// or you may pass entry component instead of defining
// it in routes\
Anew.use(Router)
    .render(AppEntry, '#root')

/**
 | ------------------
 | Using ReactDOM.render
 | ------------------
 */

ReactDOM.render(Router.wrap(), document.getElementById('root'))

// alternative
ReactDOM.render(Router.wrap(AppEntry), document.getElementById('root'))
```



## Router Components

```jsx
import Router from '@anew/router'

// Same as react-router Redirect component
// However a route name can be passed rather
// than passing the full path of `about` to the `to` prop
<Router.Redirect name='home' />

// Same as react-router Link component
<Router.Link name='about' />
```

## Router Utilities

```jsx
/**
 | ------------------
 | Routes
 | ------------------
 */

Router.use({
    routes: [
        {
            path: '/pathOne',
            component: PathOneComponent,
            name: 'path-one-name',
        },
        {
            path: '/pathTwo/:id',
            component: PathTwoComponent,
            name: 'path-two-name',
        },
        {
            path: '/group',
            name: 'group-name',
            routes: [
                {
                    path: '/one',
                    ...
                },
                {
                    path: '/two',
                    ...
                },
            ],
        },
    ]
})

/**
 | ------------------
 | Checks
 | ------------------
 */

// @return true
// Checks if group-name path matches or contains the pathname
Router.contains('/someGroup/one', 'group-name')

// @return true
// Alternative method for above
Router.get('group-name').is('/someGroup/one')

Router.get('GroupName').contains('/someGroup/one') // true

/**
 | ------------------
 | Getters
 | ------------------
 */

// @return
// [{ path: '/pathTwo/:param', component: AppComponent, name: PathTwoName, ...otherprops }]
// Return all routes that match the given pathname
Router.match('/pathTwo/1')

// @reutrn
// [{ path: '/group/one', ... }]
// You can also define a group name to check for matchs
Router.match('/group/one', { name: 'group-name' })

// @return
// [{ path: '/group/one', ... }]
// Alternative for above
Router.get('group-name').routes('/group/one')

// @return
// { path: '/pathTwo/:param', component: AppComponent, name: PathTwoName, ...otherprops }
// Returns the route's data
Router.get('path-two-name').data()

// @return
// /pathTwo:id
// Returns a specific data property
Router.get('path-two-name').data('path')

// @return
// /pathTwo/1
// Returns the route's compiled path
Router.get('path-two-name').path({ id: 1 })
```