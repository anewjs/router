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
    constructor(use) {
        this.names = {}
        this.config = {
            Router: DefaultRouter,
            Route: DefaultRoute,
            Switch: DefaultSwitch,
        }

        this.use(use)

        // Component Names
        this.Redirect.displayName = 'Router.Redirect'
        this.Link.displayName = 'Router.Link'
        this.Protect.displayName = 'Router.Protect'
    }

    use = ({ routes, component, ...config } = {}) => {
        this.setConfig(config)
        this.entry = component
        this.routes = this._build(routes)
    }

    setConfig = ({ routes, ...config } = {}) => {
        if (routes) {
            this.use(routes)
        }

        return (this.config = {
            ...this.config,
            ...config,
        })
    }

    wrap = (component, config, isRoot = false) => {
        const { history, Router, Route } = this.setConfig(config)
        const { routes, entry, _render } = this

        const route = { routes }
        const Component = component || entry
        const RouteComponent = (
            <Route
                render={props => <Component {...props} route={route} RouterView={_render(route)} />}
            />
        )

        if (isRoot) {
            const { history: routerHistory } = !history
                ? this.setConfig({ history: createBrowserHistory() })
                : this.config

            return function AnewRouter(props) {
                return (
                    <Router {...props} history={routerHistory}>
                        {RouteComponent}
                    </Router>
                )
            }
        } else {
            return function AnewRoute() {
                return RouteComponent
            }
        }
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

    Protect = ({ redirectTo, active, children, ...props }) => {
        const { Redirect } = this

        return active ? (
            <React.Fragment>{children}</React.Fragment>
        ) : (
            <Redirect name={redirectTo} {...props} />
        )
    }

    /**
    | ------------------
    | Public Methods
    | ------------------
    */

    get = name => {
        return this.names[name]
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

    /**
     | ------------------
     | Internal Methods
     | ------------------
     */

    _createFullPath = (path, parentPath) => {
        return `${parentPath}/${path}`.replace(/\/{2,}/, '/').replace(/(?!^\/)\/+$/, '')
    }

    _build = (routes = [], /*recursive param*/ parentPath = '') => {
        return routes.map(route => {
            const { _createFullPath, _build, _render, match: _match, contains: _contains } = this
            const { routes, path, name, component, render } = route
            const fullPath = _createFullPath(path, parentPath)

            route.path = fullPath

            if (routes) {
                route.routes = _build(routes, path)

                if (!component && !render) {
                    route.render = _render(route)
                }
            }

            route.actions = {
                path: compile(fullPath),
                data: prop => {
                    return prop ? route[prop] : route
                },
                is: pathname => {
                    return isMatch(pathname, fullPath)
                },
                routes: (pathname, { strict } = {}) => {
                    return _match(pathname, { name: routes, strict })
                },
                contains: (pathname, { strict } = {}) => {
                    return _contains(pathname, { name: routes, strict })
                },
            }

            if (name) {
                this.names[name] = route.actions
            }

            return route
        })
    }

    _render = ({ routes, name: parentName = '' }) => {
        const {
            Redirect,
            _render,
            config: { Switch: ConfigSwitch, Route: ConfigRoute, history },
        } = this

        if (routes) {
            return /* RouterView */ ({
                Switch = ConfigSwitch,
                Route = ConfigRoute,
                ...extraProps
            } = {}) => (
                <Switch location={history.location}>
                    {routes.map((route, i) => {
                        const {
                            name,
                            path,
                            strict,
                            render,
                            redirectTo,
                            routes,
                            exact = true,
                            component: Component,
                        } = route

                        return (
                            <Route
                                key={`${parentName}(${name || i})`}
                                path={path}
                                exact={routes ? false : exact}
                                strict={strict}
                                render={props => {
                                    const componentProps = {
                                        ...props,
                                        ...extraProps,
                                        RouterView: _render(route),
                                        route,
                                    }

                                    return redirectTo ? (
                                        <Redirect
                                            {...(typeof redirectTo === 'function'
                                                ? redirectTo(this)
                                                : redirectTo)}
                                        />
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
            )
        }
    }
}

export default new AnewRouter()
