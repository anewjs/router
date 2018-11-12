# Anew Router

> A lightweight React Router framework
> Use [react-navigation](https://reactnavigation.org/) for react native routes.

The routes utility uses `react-router-dom` and `react-router-config` to define application routes. The utility adopts a cascading syntax (method chaining) to build the config passed to `react-router-config`.

## Table of Contents

-   [Installation](#installation)
-   [Creating Routes](#creating-routes)
-   [Rendering Routes](#rendering-routes)
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

## Creating Routes

The `Router` utility allows you to create routes and collections/groups of routes in a more readable and understandable fashion.

```jsx
import React from 'react' // for JSX
import Router from '@anew/routes'

/**
 * @param   { String }          route path
 * @param   { React Component } route component
 * @param   { Object }          route properties
 * @returns { Object }          react-router-config route object
 */
Router.route('/somePath', SomeComponent, {
    title: 'My Component', // Custom property
    exact: true, // react-router property
})

/*
 * React Router Config Equivalent
 * [
 *     {
 *         path: '/somePath',
 *         component: SomeComponent,
 *         name: 'My Component',
 *         exact: true,
 *     },
 * ]
 */

/**
 | ------------------
 | Cascading Route
 | ------------------
 | A cascading route remains a sibling to the previous route
 | with its path being appending to the previous path.
 */

Router.route('/route1', ComponentOne).route('/route2', ComponentTwo)

/*
 * React Router Config Equivalent
 * [
 *     {
 *         path: '/route1',
 *         component: ComponentOne,
 *     },
 *     {
 *         path: '/route1/route2',
 *         component: ComponentTwo,
 *     },
 * ]
 */

/**
 | ------------------
 | Group
 | ------------------
 | A group is a cluster of sibling routes defined under one parent.
 | The entire application's routes fall under one group, which could include
 | sub-groups as children.
 */

/**
 * The current component is a routes template component that renders
 * the children routes for a given route inside this template wrapper.
 *
 * @param { Object } props.route The current route config
 */
function GroupTemplate(props) {
    return (
        <div>
            <h1>Group Header</h1>
            <div>{Router.render(props.route)}</div>
            <div>Group Footer</div>
        </div>
    )
}

/**
 * @param  { String }           Group Path
 * @param  { Function }         Group Route Builder
 * @param  { Object  }          Optional - Group Route Properties
 * @param  { React Component }  Optional React Template Component. By default
 *                              will render childern routes with no component
 *                              wrapper.
 */
Router.group(
    '/someGroupPath',
    Group => {
        Group.route('/route1', ComponentOne)

        Group.route('/route2', ComponentTwo).route('/route3', ComponentThree)
    },
    GroupTemplate
)

/*
 * React Router Config Equivalent
 * [
 *     {
 *         path: '/someGroupPath',
 *         component: GroupTemplate,
 *         routes: [
 *              {
 *                  path: '/route1',
 *                  component: ComponentOne,
 *              },
 *              {
 *                  path: '/route2',
 *                  component: ComponentTwo,
 *              },
 *              {
 *                  path: '/route2/route2',
 *                  component: ComponentThree,
 *              },
 *         ],
 *     },
 * ]
 */

Router.group(
    '/someGroupPath',
    Group => {
        Group.route('/route1', ComponentOne)

        Group.route('/route2', ComponentTwo).route('/route3', ComponentThree)
    },
    {
        exact: true,
    },
    GroupTemplate
)

/*
 * React Router Config Equivalent
 * [
 *     {
 *         path: '/someGroupPath',
 *         component: GroupTemplate,
 *         exact: true,  <------------- ADDITION
 *         routes: [
 *              {
 *                  path: '/route1',
 *                  component: ComponentOne,
 *              },
 *              {
 *                  path: '/route2',
 *                  component: ComponentTwo,
 *              },
 *              {
 *                  path: '/route2/route2',
 *                  component: ComponentThree,
 *              },
 *         ],
 *     },
 * ]
 */
```

### Parameters

```js
Router.route(
    path: String,
    component: ReactComponent,
    props: Object
)
```

`path`: The route path that renders the component when visited. This may be
any valid URL path or array of paths that [path-to-regexp@^1.7.0](https://github.com/pillarjs/path-to-regexp/tree/v1.7.0) understands. You may also test your regex using this [online tool](https://pshrmn.github.io/route-tester/#/).

`component`: A React component to render only when the location matches. It will be rendered with route props.

`props`: Additional React Router Route or custom props. Custom props are accessible by route getter.

```js
Router.group(
    path: String,
    groupBuilder: Function,
    [props: Object],
    [component: ReactComponent]
)
```

`path`: The group path that gets prepended to children routes.

`groupBulder`: Passes a group Routes manager for building routes within the group.

`props`: Additional React Router Switch or custom props.

`component`(Optional): A React Component that wraps the children routes. Useful for creating a templates that render across all children routes.

## Rendering Routes

```jsx
import { render } from 'react-dom'
import { Router } from 'react-router-dom'
import React from 'react'
import Router from '@anew/router'

/**
 | ------------------
 | Components
 | ------------------
 */

class AppTemplate extends React.Component {
    render() {
        const { route } = this.props

        return (
            <div className="container">
                <div>Applications</div>
                <div className="body">{Router.render(route)}</div>
                <button>Action</button>
            </div>
        )
    }
}

class AppEntry extends React.Component {
    render() {
        const { route } = this.props

        return (
            <div className="container">
                <Navbar />
                <div className="body">{Router.render(route)}</div>
                <Footer />
            </div>
        )
    }
}

/**
 | ------------------
 | Routes
 | ------------------
 */

Router.route('/home', HomeComponent)

Router.route('/about', AboutComponent)

Router.group(
    '/app',
    AppGroup => {
        AppGroup.route('/todo', ToDoComponent)

        AppGroup.route('/calculator', CalculatorComponent)
    },
    AppTemplate
)

/**
 | ------------------
 | Mount
 | ------------------
 */

render(Router.wrap(AppEntry), document.getElementById('root'))
```

### Parameters

```js
Routes.render(
    route: Object,
    {
        Switch: ReactComponent,
        Route: ReactComponent,
        extraProps: Object,
    },
)
```

`route`: A route object containing children routes.

`Switch` (Optional): A React Router Switch Component used to wrap the rendered routes.

`Route` (Optional): A React Router Route Component used to wrap each route.

`extraProps` (Optional): Additional props passed to each component under the each route.

```js
Routes.wrap(
    Component: ReactComponent,
    {
        id: String,
        Router: ReactComponent,
        history: Object,
    },
)
```

`Component`: A react component to wrap around the configured routes.

`id` (Optional): DOM id to mount wrapped react component to.

`Router` (Optional): React Router Component that wraps the `Component` (default to React Router).

`history` (Optional): A history object to use for navigation (default to browser history).

The wrap method returns the `Component` wrapped around a router with the configured routes. This could be used with any component that you want wrap some routes. Most often, this method is used to wrap the application's routes around the application. Note, you should not pass the id parameter to wrap a sub component from the appliation as that attempts to mount the component to the DOM at the provided element `id`.

```js
import Router, { RouterCore } from '@anew/router'


class TodoComponent {...}
class EntryComponent {...}

// Alternative:
// const TodoRouter = new RouterCore()
//
// Then build the todoRoutes using the router methods
//
// TodoRouter.route(1)
// TodoRouter.group()
//
// and so on.
const TodoRouter = new RouterCore(todoRoutes)

TodoRouter.wrap(TodoComponent) /* => (
    <Router>
        <TodoComponent />
    </Router>
)*/

Router.store(rootRoutes)

Router.wrap(EntryComponent, { id: 'root' }) /* => {
    ReactDOM.render((
        <Router>
            <EntryComponent />
        </Router>
    ), document.getElementById('root'))

    return (
        <Router>
            <EntryComponent />
        </Router
    )
}*/
```

## Router Utilities

```js
/**
 | ------------------
 | Routes
 | ------------------
 */

Router.route('/pathOne', AppComponent, { name: 'PathOneName' })

Router.route('/pathTwo/:param', AppComponent, { name: 'PathTwoName' })

Router.route(
    '/someGroup',
    Group => {
        Group.route('/one')

        Group.route('/two')
    },
    {
        name: 'GroupName',
    }
)

/**
 | ------------------
 | Checks
 | ------------------
 */

Router.match('/pathTwo/1') /*=> [
    { path: '/pathTwo/:param', component: AppComponent, name: PathTwoName, ...otherprops },
]*/

Router.contains('/someGroup/one', 'GroupName') // => true

Router.get('PathTwoName').is('/pathTwo/1') // => true

Router.get('GroupName').contains('/someGroup/one') // true

/**
 | ------------------
 | Getters
 | ------------------
 */

Router.get('PathTwoName').data() /*=> { 
    path: '/pathTwo/:param', 
    component: AppComponent, 
    name: PathTwoName, 
    ...otherprops 
},*/

Router.get('GroupName').routes('/someGroup/one') /*=> [
    { path: '/someGroup/one', ...otherprops },
]*/
```
