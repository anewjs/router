import {
    Route as DefaultRoute,
    Router as DefaultRouter,
    Switch as DefaultSwitch,
    Redirect as ReactRouterRedirect,
    Link as ReactRouterLink,
} from 'react-router-dom'
import { compile } from 'path-to-regexp'
import React from 'react'
import createBrowserHistory from 'history/createBrowserHistory'
import trimStart from 'lodash.trimstart'

import isMatch from './isMatch'
import matchRoutes from './matchRoutes'

export class AnewRouter {
    constructor(use, config = {}) {
        this.configuration = config
        this.use(use)

        // Component Names
        this.Redirect.displayName = 'Router.Redirect'
        this.Link.displayName = 'Router.Link'
        this.Protect.displayName = 'Router.Protect'
    }

    use = ({ routes, component, ...config } = {}) => {
        this.config(config)

        this.names = {}
        this.entry = component
        this.routes = this.build(routes)
    }

    config = ({ routes, ...config } = {}) => {
        if (routes) {
            this.use(routes)
        }

        this.configuration = {
            ...this.configuration,
            ...config,
        }
    }

    wrap = (Component, config, isRoot = false) => {
        this.config(config)

        let { history } = this.configuration

        if (!isRoot) {
            history = undefined
        } else if (!history) {
            history = createBrowserHistory()
        }

        const { Router = DefaultRouter, Route = DefaultRoute } = this.configuration
        const route = { routes: this.routes }

        if (!Component) {
            Component = this.entry
        }

        const RouteComponent = (
            <Route
                render={props => (
                    <Component
                        {...props}
                        route={route}
                        RouterView={config => this.render(route, config)}
                    />
                )}
            />
        )

        const AnewRouter = history
            ? () => <Router history={history}>{RouteComponent}</Router>
            : () => RouteComponent

        AnewRouter.displayName = 'AnewRouter'

        return AnewRouter
    }

    /**
     | ------------------
     | Components
     | ------------------
     */

    Redirect = ({ name, params, method = 'path', ...props }) => {
        return (
            <ReactRouterRedirect
                to={this.get(name)[method](method === 'data' && !params ? 'path' : params)}
                {...props}
            />
        )
    }

    Link = ({ name, params, method = 'path', ...props }) => {
        return (
            <ReactRouterLink
                to={this.get(name)[method](method === 'data' && !params ? 'path' : params)}
                {...props}
            />
        )
    }

    Protect = ({ redirectTo, active, params, method = 'path', children, ...props }) => {
        return active ? (
            <React.Fragment>{children}</React.Fragment>
        ) : (
            <ReactRouterRedirect
                to={this.get(redirectTo)[method](method === 'data' && !params ? 'path' : params)}
                {...props}
            />
        )
    }

    /**
     | ------------------
     | Internal Methods
     | ------------------
     */

    get = name => {
        return this.names[name]
    }

    createFullPath = (path, parentPath) => {
        return `${parentPath}/${path}`.replace(/\/{2,}/, '/').replace(/(?!^\/)\/+$/, '')
    }

    build = (routes = [], /*recursive param*/ parentPath = '') => {
        return routes.map(route => {
            const { routes, path, name, redirectTo, component, render } = route
            const fullPath = this.createFullPath(path, parentPath)

            route.path = fullPath

            if (typeof redirectTo === 'string') {
                route.redirectTo = () => {
                    const routeFromName = this.get(redirectTo)

                    return routeFromName
                        ? routeFromName.path()
                        : this.createFullPath(redirectTo, parentPath)
                }
            }

            if (routes) {
                route.routes = this.build(routes, path)

                if (!component && !render) {
                    route.render = config => this.render(route, config)
                }
            }

            route.actions = {
                path: compile(fullPath),
                data: prop => (prop ? route[prop] : route),
                is: pathname => isMatch(pathname, fullPath),
                routes: (pathname, { strict } = {}) =>
                    this.match(pathname, { name: routes, strict }),
                contains: (pathname, { strict } = {}) =>
                    this.contains(pathname, { name: routes, strict }),
            }

            if (name) {
                this.names[name] = route.actions
            }

            return route
        })
    }

    render = ({ routes, name: parentName = '' }, config) => {
        this.config(config)

        const {
            Switch = DefaultSwitch,
            Route = DefaultRoute,
            history,
            ...extraProps
        } = this.configuration

        return routes ? (
            <Switch {...(history ? { location: history.location } : {})}>
                {routes.map((route, i) => {
                    const {
                        name,
                        path,
                        strict,
                        render,
                        redirectTo,
                        routes,
                        exact = !routes,
                        component: Component,
                    } = route

                    return (
                        <Route
                            key={`${parentName}(${name || i})`}
                            path={path}
                            exact={exact}
                            strict={strict}
                            render={props => {
                                const componentProps = {
                                    ...props,
                                    ...extraProps,
                                    RouterView: config => this.render(route, config),
                                    route,
                                }

                                return redirectTo ? (
                                    typeof redirectTo === 'function' ? (
                                        redirectTo(componentProps)
                                    ) : (
                                        <this.Redirect {...redirectTo} />
                                    )
                                ) : Component ? (
                                    <Component {...componentProps} />
                                ) : (
                                    render(componentProps)
                                )
                            }}
                        />
                    )
                })}
            </Switch>
        ) : null
    }

    /**
     * Get All matching routes for pathname in first level routes group
     *
     * @param  { String }        pathname Check string
     * @param  { String|Array }  name     Route group name/routes (Optional)
     * @param  { Boolean }       strict   Strict pathname check
     * @return { Array }                  Matched routes
     */
    match = (pathname, { name, strict = true } = {}) => {
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
    contains = (pathname, { name, strict } = {}) => {
        return !!this.match(pathname, { name, strict }).length
    }
}

export default new AnewRouter()
