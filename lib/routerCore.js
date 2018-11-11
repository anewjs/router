'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RouterCore = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) { descriptor.writable = true; } Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) { defineProperties(Constructor.prototype, protoProps); } if (staticProps) { defineProperties(Constructor, staticProps); } return Constructor; }; }();

var _reactRouterDom = require('react-router-dom');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash.trimstart');

var _lodash2 = _interopRequireDefault(_lodash);

var _createRouteChainMethods = require('./createRouteChainMethods');

var _createRouteChainMethods2 = _interopRequireDefault(_createRouteChainMethods);

var _matchRoutes = require('./matchRoutes');

var _matchRoutes2 = _interopRequireDefault(_matchRoutes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) { continue; } if (!Object.prototype.hasOwnProperty.call(obj, i)) { continue; } target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RouterCore = function () {
    function RouterCore() {
        var routes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        _classCallCheck(this, RouterCore);

        this.routes = routes;
        this.routesByName = {};
    }

    /**
     * Render Application Routes
     *
     * @param  {Object}   route        route
     * @param  {Object}   extraProps   Props passed down to routes
     * @return {Function}              React Switch/Route
     */


    _createClass(RouterCore, [{
        key: 'render',
        value: function render(RouteContainer) {
            var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var _ref$switch = _ref.switch,
                Switch = _ref$switch === undefined ? _reactRouterDom.Switch : _ref$switch,
                _ref$route = _ref.route,
                Route = _ref$route === undefined ? _reactRouterDom.Route : _ref$route,
                extraProps = _objectWithoutProperties(_ref, ['switch', 'route']);

            if (typeof RouteContainer === 'function') {
                return _react2.default.createElement(RouteContainer, _extends({}, extraProps, { route: this.routes }));
            }

            var routes = RouteContainer.routes;


            return routes ? _react2.default.createElement(
                Switch,
                null,
                routes.map(function (route, i) {
                    return _react2.default.createElement(Route, {
                        key: route.key || i,
                        path: route.path,
                        exact: route.exact,
                        strict: route.strict,
                        render: function render(props) {
                            return route.render ? route.render(_extends({}, props, extraProps, { route: route })) : _react2.default.createElement(route.component, _extends({}, props, extraProps, { route: route }));
                        }
                    });
                })
            ) : null;
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

    }, {
        key: 'route',
        value: function route() {
            var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
            var component = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            var _this = this;

            var base = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
            var _route = arguments[4];

            var routes = !_route ? this.routes : _route;
            var index = routes.length;
            var selectedPath = (base + path).replace(/\/{2,}/, '/');
            var name = props.name;


            if (name) {
                this.routesByName[name] = (0, _createRouteChainMethods2.default)(this, name, selectedPath, routes[index]);
            }

            routes.push(_extends({
                exact: true
            }, props, {
                component: component,
                path: selectedPath,
                route: function route() {
                    var siblings_path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
                    var siblings_component = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
                    var siblings_props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

                    return _this.route(siblings_path, siblings_component, siblings_props, path);
                }
            }));

            return routes[index];
        }

        /**
         * Define Application Route Container
         *
         * @param  {String} path         base path
         * @param  {Function} callBack   A callback with the group container passed as a parameter
         * @param  {Function} component  React Component (optional)
         * @param  {Object}   route      Route reference (not public API)
         */

    }, {
        key: 'group',
        value: function group(path, callBack) {
            var Props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            var _this2 = this;

            var component = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
            var /*not public API*/route = arguments[4];

            var routes = !route ? this.routes : route;
            var index = routes.length;

            var isPropsComponent = (typeof Props === 'undefined' ? 'undefined' : _typeof(Props)) !== 'object' && _react2.default.isValidElement(_react2.default.createElement(Props, null));
            var selectedComponent = isPropsComponent ? Props : component;
            var selectedProps = isPropsComponent ? {} : Props;
            var name = selectedProps.name;


            if (name) {
                this.routesByName[name] = (0, _createRouteChainMethods2.default)(this, name, path, routes[index]);
            }

            routes.push(_extends({}, selectedProps, {
                path: path,
                routes: [],
                component: !selectedComponent ? function () {
                    return _this2.render(routes[index]);
                } : selectedComponent,
                group: function group(childs_path, callBack, props, component) {
                    return _this2.group(path + childs_path, callBack, props, component, routes[index].routes);
                },
                route: function route() {
                    var siblings_path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
                    var siblings_component = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
                    var siblings_props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

                    return _extends({}, _this2.route(siblings_path, siblings_component, siblings_props, path, routes[index].routes), {
                        route: function route() {
                            var grandchilds_path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
                            var grandchilds_component = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
                            var grandchilds_props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

                            return routes[index].route(siblings_path + grandchilds_path, grandchilds_component, grandchilds_props);
                        }
                    });
                }
            }));

            callBack(routes[index]);
        }

        /**
         * Get Public Route Object
         *
         * @param  { String } name   Route name if assigned
         * @return { Object }        Methods binded to route name
         */

    }, {
        key: 'get',
        value: function get(name) {
            return this.routesByName[name];
        }

        /**
         * Get All matching routes for pathname in first level routes group
         *
         * @param  { String }        pathname Check string
         * @param  { String|Array }  name     Route group name/routes (Optional)
         * @param  { Boolean }       strict   Strict pathname check
         * @return { Array }                  Matched routes
         */

    }, {
        key: 'match',
        value: function match(pathname) {
            var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                name = _ref2.name,
                _ref2$strict = _ref2.strict,
                strict = _ref2$strict === undefined ? true : _ref2$strict;

            switch (typeof name === 'undefined' ? 'undefined' : _typeof(name)) {
                case 'string':
                    var _get$data = this.get(name).data(),
                        routes = _get$data.routes,
                        path = _get$data.path;

                    if (routes) {
                        return (0, _matchRoutes2.default)(routes, strict ? pathname : path + '/' + (0, _lodash2.default)(pathname, '/'));
                    }

                    return [];
                case 'object':
                    return (0, _matchRoutes2.default)(name, pathname);
                default:
                    return (0, _matchRoutes2.default)(this.routes, pathname);
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

    }, {
        key: 'contains',
        value: function contains(pathname) {
            var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                name = _ref3.name,
                strict = _ref3.strict;

            return !!this.match(pathname, name, strict).length;
        }
    }]);

    return RouterCore;
}();

exports.RouterCore = RouterCore;
exports.default = new RouterCore();