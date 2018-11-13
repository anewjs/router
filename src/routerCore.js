import { Router as DefaultRouter, Switch as DefaultSwitch } from 'react-router-dom'
import { Route as DefaultRoute } from 'react-router-dom'
import { render } from 'react-dom'
import React from 'react'
import trimStart from 'lodash.trimstart'
import createBrowserHistory from 'history/createBrowserHistory'
import createRouteChainMethods from './createRouteChainMethods'
import matchRoutes from './matchRoutes'

export class RouterCore {
    constructor(routes = []) {
        this.routes = routes
        this.routesByName = {}
    }

    /**
     * Wrap Component around Routes
     *
     * @param  {Function} Component       React Component
     * @param  {Function} options.router  React Route Component
     * @param  {Object}   options.history  History Object
     * @return {Function}                 Rect Component
     */
    wrap(
        Component,
        { id, Router = DefaultRouter, Route = DefaultRoute, history = createBrowserHistory() } = {}
    ) {
        const route = { routes: this.routes }
        const RouteComponent = <Route render={props => <Component {...props} route={route} />} />
        const AnewRouter = history
            ? () => <Router history={history}>{RouteComponent}</Router>
            : () => RouteComponent

        AnewRouter.displayName = 'AnewRouter'

        if (id) {
            render(<AnewRouter />, document.getElementById(id))
        }

        return AnewRouter
    }

    /**
     * Render Application Routes
     *
     * @param  {Object}   route        route
     * @param  {Object}   extraProps   Props passed down to routes
     * @return {Function}              React Switch/Route
     */
    render({ routes }, { Switch = DefaultSwitch, Route = DefaultRoute, ...extraProps } = {}) {
        return routes ? (
            <Switch>
                {routes.map((route, i) => (
                    <Route
                        key={route.key || i}
                        path={route.path}
                        exact={route.exact}
                        strict={route.strict}
                        render={props =>
                            route.render ? (
                                route.render({ ...props, ...extraProps, route })
                            ) : (
                                <route.component {...props} {...extraProps} route={route} />
                            )
                        }
                    />
                ))}
            </Switch>
        ) : null
    }

    /**
     * Define Application Route
     *
     * @param  {String}   path      Route path
     * @param  {Function} component React Component
     * @param  {Object}   props     Extra Props to pass to React Route
     * @param  {String}   base      base path         (not public API)
     * @param  {Object}   route     Route reference   (not public API)
     * @return {Object}             Route reference
     */
    route(path = '', component = null, props = {}, /*not public API*/ base = '', route) {
        const routes = !route ? this.routes : route
        const index = routes.length
        const selectedPath = (base + path).replace(/\/{2,}/, '/')
        const { name } = props

        if (name) {
            this.routesByName[name] = createRouteChainMethods(
                this,
                name,
                selectedPath,
                routes[index]
            )
        }

        routes.push({
            exact: true,
            ...props,
            component,
            path: selectedPath,
            route: (siblings_path = '', siblings_component = null, siblings_props = {}) => {
                return this.route(siblings_path, siblings_component, siblings_props, path)
            },
        })

        return routes[index]
    }

    /**
     * Define Application Route Container
     *
     * @param  {String} path         base path
     * @param  {Function} callBack   A callback with the group container passed as a parameter
     * @param  {Function} component  React Component (optional)
     * @param  {Object}   route      Route reference (not public API)
     */
    group(path, callBack, Props = {}, component = null, /*not public API*/ route) {
        const routes = !route ? this.routes : route
        const index = routes.length

        const isPropsComponent = typeof Props !== 'object' && React.isValidElement(<Props />)
        const selectedComponent = isPropsComponent ? Props : component
        const selectedProps = isPropsComponent ? {} : Props
        const { name } = selectedProps

        if (name) {
            this.routesByName[name] = createRouteChainMethods(this, name, path, routes[index])
        }

        routes.push({
            ...selectedProps,
            path,
            routes: [],
            component: !selectedComponent ? () => this.render(routes[index]) : selectedComponent,
            group: (childs_path, callBack, props, component) => {
                return this.group(
                    path + childs_path,
                    callBack,
                    props,
                    component,
                    routes[index].routes
                )
            },
            route: (siblings_path = '', siblings_component = null, siblings_props = {}) => {
                return {
                    ...this.route(
                        siblings_path,
                        siblings_component,
                        siblings_props,
                        path,
                        routes[index].routes
                    ),
                    route: (
                        grandchilds_path = '',
                        grandchilds_component = null,
                        grandchilds_props = {}
                    ) => {
                        return routes[index].route(
                            siblings_path + grandchilds_path,
                            grandchilds_component,
                            grandchilds_props
                        )
                    },
                }
            },
        })

        callBack(routes[index])
    }

    /**
     * Get Public Route Object
     *
     * @param  { String } name   Route name if assigned
     * @return { Object }        Methods binded to route name
     */
    get(name) {
        return this.routesByName[name]
    }

    /**
     * Get All matching routes for pathname in first level routes group
     *
     * @param  { String }        pathname Check string
     * @param  { String|Array }  name     Route group name/routes (Optional)
     * @param  { Boolean }       strict   Strict pathname check
     * @return { Array }                  Matched routes
     */
    match(pathname, { name, strict = true } = {}) {
        switch (typeof name) {
            case 'string':
                const { routes, path } = this.get(name).data()

                if (routes) {
                    return matchRoutes(
                        routes,
                        strict ? pathname : `${path}/${trimStart(pathname, '/')}`
                    )
                }

                return []
            case 'object':
                return matchRoutes(name, pathname)
            default:
                return matchRoutes(this.routes, pathname)
        }
    }

    /**
     * Check if route contains pathname in children routes
     *
     * @param  { String }  pathname Check string
     * @param  { String }  name     Route group name (Optional)
     * @param  { Boolean } strict   Strict pathname check
     * @return { Boolean }
     */
    contains(pathname, { name, strict } = {}) {
        return !!this.match(pathname, name, strict).length
    }
}

export default new RouterCore()
