'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AnewRouter = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reactRouterDom = require('react-router-dom');

var _pathToRegexp = require('path-to-regexp');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _createBrowserHistory = require('history/createBrowserHistory');

var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

var _lodash = require('lodash.trimstart');

var _lodash2 = _interopRequireDefault(_lodash);

var _isMatch = require('./isMatch');

var _isMatch2 = _interopRequireDefault(_isMatch);

var _matchRoutes = require('./matchRoutes');

var _matchRoutes2 = _interopRequireDefault(_matchRoutes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) { continue; } if (!Object.prototype.hasOwnProperty.call(obj, i)) { continue; } target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AnewRouter = exports.AnewRouter = function AnewRouter(config) {
    _classCallCheck(this, AnewRouter);

    _initialiseProps.call(this);

    this.use(config);
}

/**
 | ------------------
 | Components
 | ------------------
 */

/**
 | ------------------
 | Internal Methods
 | ------------------
 */

/**
 * Get All matching routes for pathname in first level routes group
 *
 * @param  { String }        pathname Check string
 * @param  { String|Array }  name     Route group name/routes (Optional)
 * @param  { Boolean }       strict   Strict pathname check
 * @return { Array }                  Matched routes
 */


/**
 * Check if route contains pathname in children routes
 *
 * @param  { String }  pathname Check string
 * @param  { String }  name     Route group name (Optional)
 * @param  { Boolean } strict   Strict pathname check
 * @return { Boolean }
 */
;

var _initialiseProps = function _initialiseProps() {
    var _this = this;

    this.use = function () {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var routes = _ref.routes,
            component = _ref.component,
            configuration = _objectWithoutProperties(_ref, ['routes', 'component']);

        _this.names = {};
        _this.entry = component;
        _this.routes = _this.build(routes);
        _this.config(configuration);
    };

    this.config = function (configuration) {
        _this.configuration = configuration;
    };

    this.wrap = function () {
        var Component = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.entry;
        var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var _config$configuration = _extends({}, config, _this.configuration),
            _config$configuration2 = _config$configuration.Router,
            Router = _config$configuration2 === undefined ? _reactRouterDom.Router : _config$configuration2,
            _config$configuration3 = _config$configuration.Route,
            Route = _config$configuration3 === undefined ? _reactRouterDom.Route : _config$configuration3,
            _config$configuration4 = _config$configuration.isRoot,
            isRoot = _config$configuration4 === undefined ? false : _config$configuration4,
            history = _config$configuration.history;

        if (isRoot && !history) {
            history = (0, _createBrowserHistory2.default)();
        }

        var route = { routes: _this.routes };

        var RouteComponent = _react2.default.createElement(Route, {
            render: function render(props) {
                return _react2.default.createElement(Component, _extends({}, props, {
                    route: route,
                    RouterView: function RouterView(config) {
                        return _this.render(route, config);
                    }
                }));
            }
        });

        var AnewRouter = history ? function () {
            return _react2.default.createElement(
                Router,
                { history: history },
                RouteComponent
            );
        } : function () {
            return RouteComponent;
        };

        AnewRouter.displayName = 'AnewRouter';

        return AnewRouter;
    };

    this.Redirect = function (_ref2) {
        var name = _ref2.name,
            params = _ref2.params,
            _ref2$method = _ref2.method,
            method = _ref2$method === undefined ? 'path' : _ref2$method,
            props = _objectWithoutProperties(_ref2, ['name', 'params', 'method']);

        var route = _this.get(name);

        return _react2.default.createElement(_reactRouterDom.Redirect, _extends({
            to: route[method](method === 'data' && !params ? 'path' : params)
        }, props));
    };

    this.Link = function (_ref3) {
        var name = _ref3.name,
            params = _ref3.params,
            _ref3$method = _ref3.method,
            method = _ref3$method === undefined ? 'path' : _ref3$method,
            props = _objectWithoutProperties(_ref3, ['name', 'params', 'method']);

        var route = _this.get(name);

        return _react2.default.createElement(_reactRouterDom.Link, _extends({
            to: route[method](method === 'data' && !params ? 'path' : params)
        }, props));
    };

    this.get = function (name) {
        return _this.names[name];
    };

    this.createFullPath = function (path, parentPath) {
        return (parentPath + '/' + path).replace(/\/{2,}/, '/');
    };

    this.build = function () {
        var routes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var parentPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var _a = routes;

        var _f = function _f(route) {
            var _routes = route.routes,
                path = route.path,
                name = route.name,
                redirectTo = route.redirectTo,
                component = route.component,
                render = route.render;


            route.path = _this.createFullPath(path, parentPath);

            if (typeof redirectTo === 'string') {
                route.redirectTo = function () {
                    var routeFromName = _this.get(redirectTo);

                    return routeFromName ? routeFromName.path() : _this.createFullPath(redirectTo, parentPath);
                };
            }

            if (_routes) {
                route.routes = _this.build(_routes, path);

                if (!component || !render) {
                    route.component = function (config) {
                        return _this.render(route, config);
                    };
                    route.component.displayName = 'AnewRoutes(' + name + ')';
                }
            }

            if (name) {
                _this.names[name] = {
                    path: (0, _pathToRegexp.compile)(path),
                    data: function data(prop) {
                        return props ? route[prop] : route;
                    },
                    is: function is(pathname) {
                        return (0, _isMatch2.default)(pathname, path);
                    },
                    routes: function routes(pathname) {
                        var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                            strict = _ref4.strict;

                        return _this.match(pathname, { name: _routes, strict: strict });
                    },
                    contains: function contains(pathname) {
                        return _this.contains(pathname, { name: _routes, strict: strict });
                    }
                };
            }

            return route;
        };

        var _r = [];

        for (var _i = 0; _i < _a.length; _i++) {
            _r.push(_f(_a[_i], _i, _a));
        }

        return _r;
    };

    this.render = function (_ref6) {
        var routes = _ref6.routes;

        var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var _ref5$Switch = _ref5.Switch,
            Switch = _ref5$Switch === undefined ? _reactRouterDom.Switch : _ref5$Switch,
            _ref5$Route = _ref5.Route,
            Route = _ref5$Route === undefined ? _reactRouterDom.Route : _ref5$Route,
            extraProps = _objectWithoutProperties(_ref5, ['Switch', 'Route']);

        return routes ? _react2.default.createElement(
            Switch,
            null,
            routes.map(function (route, i) {
                var name = route.name,
                    path = route.path,
                    strict = route.strict,
                    _render = route.render,
                    redirectTo = route.redirectTo,
                    _route$exact = route.exact,
                    exact = _route$exact === undefined ? true : _route$exact,
                    Component = route.component;


                return _react2.default.createElement(Route, {
                    key: name || i,
                    path: path,
                    exact: exact,
                    strict: strict,
                    render: function render(props) {
                        var componentProps = _extends({}, props, extraProps, {
                            RouterView: function RouterView(config) {
                                return _this.render(route, config);
                            },
                            route: route
                        });

                        var redirect = redirectTo && redirectTo(componentProps);

                        return redirect ? typeof redirect === 'string' ? _react2.default.createElement(_reactRouterDom.Redirect, { to: redirect }) : redirect : Component ? _react2.default.createElement(Component, componentProps) : _render(componentProps);
                    }
                });
            })
        ) : null;
    };

    this.match = function (pathname) {
        var _ref7 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            name = _ref7.name,
            _ref7$strict = _ref7.strict,
            strict = _ref7$strict === undefined ? true : _ref7$strict;

        switch (typeof name === 'undefined' ? 'undefined' : _typeof(name)) {
            case 'string':
                var _get$data = _this.get(name).data(),
                    routes = _get$data.routes,
                    path = _get$data.path;

                if (routes) {
                    return (0, _matchRoutes2.default)(routes, strict ? pathname : path + '/' + (0, _lodash2.default)(pathname, '/'));
                }

                return [];
            case 'object':
                return (0, _matchRoutes2.default)(name, pathname);
            default:
                return (0, _matchRoutes2.default)(_this.routes, pathname);
        }
    };

    this.contains = function (pathname) {
        var _ref8 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            name = _ref8.name,
            strict = _ref8.strict;

        return !!_this.match(pathname, name, strict).length;
    };
};

exports.default = new AnewRouter();