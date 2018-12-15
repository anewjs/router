import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Route as DefaultRoute, Router as DefaultRouter, Switch as DefaultSwitch, Redirect as ReactRouterRedirect, Link as ReactRouterLink } from 'react-router-dom';
import { compile } from 'path-to-regexp';
import React from 'react';
import createBrowserHistory from 'history/createBrowserHistory';
import trimStart from 'lodash.trimstart';
import isMatch from './isMatch';
import matchRoutes from './matchRoutes';
export var AnewRouter = function AnewRouter(_config) {
  var _this = this;

  _defineProperty(this, "use", function (_ref) {
    if (_ref === void 0) {
      _ref = {};
    }

    var _ref2 = _ref,
        routes = _ref2.routes,
        component = _ref2.component,
        configuration = _objectWithoutPropertiesLoose(_ref2, ["routes", "component"]);

    _this.names = {};
    _this.entry = component;
    _this.routes = _this.build(routes);

    _this.config(configuration);
  });

  _defineProperty(this, "config", function (configuration) {
    _this.configuration = configuration || {};
  });

  _defineProperty(this, "wrap", function (Component, config, isRoot) {
    if (config === void 0) {
      config = {};
    }

    if (isRoot === void 0) {
      isRoot = false;
    }

    var _this$configuration$c = _extends({}, _this.configuration, config),
        _this$configuration$c2 = _this$configuration$c.Router,
        Router = _this$configuration$c2 === void 0 ? DefaultRouter : _this$configuration$c2,
        _this$configuration$c3 = _this$configuration$c.Route,
        Route = _this$configuration$c3 === void 0 ? DefaultRoute : _this$configuration$c3,
        history = _this$configuration$c.history,
        routes = _this$configuration$c.routes;

    if (routes) {
      _this.use(routes);
    }

    if (!Component) {
      Component = _this.entry;
    }

    if (!isRoot) {
      history = undefined;
    } else if (!history) {
      history = createBrowserHistory();
    }

    var route = {
      routes: _this.routes
    };
    var RouteComponent = React.createElement(Route, {
      render: function render(props) {
        return React.createElement(Component, _extends({}, props, {
          route: route,
          RouterView: function RouterView(config) {
            return _this.render(route, config);
          }
        }));
      }
    });
    var AnewRouter = history ? function () {
      return React.createElement(Router, {
        history: history
      }, RouteComponent);
    } : function () {
      return RouteComponent;
    };
    AnewRouter.displayName = 'AnewRouter';
    return AnewRouter;
  });

  _defineProperty(this, "Redirect", function (_ref3) {
    var name = _ref3.name,
        params = _ref3.params,
        _ref3$method = _ref3.method,
        method = _ref3$method === void 0 ? 'path' : _ref3$method,
        props = _objectWithoutPropertiesLoose(_ref3, ["name", "params", "method"]);

    return React.createElement(ReactRouterRedirect, _extends({
      to: _this.get(name)[method](method === 'data' && !params ? 'path' : params)
    }, props));
  });

  _defineProperty(this, "Link", function (_ref4) {
    var name = _ref4.name,
        params = _ref4.params,
        _ref4$method = _ref4.method,
        method = _ref4$method === void 0 ? 'path' : _ref4$method,
        props = _objectWithoutPropertiesLoose(_ref4, ["name", "params", "method"]);

    return React.createElement(ReactRouterLink, _extends({
      to: _this.get(name)[method](method === 'data' && !params ? 'path' : params)
    }, props));
  });

  _defineProperty(this, "Protect", function (_ref5) {
    var redirectTo = _ref5.redirectTo,
        active = _ref5.active,
        params = _ref5.params,
        _ref5$method = _ref5.method,
        method = _ref5$method === void 0 ? 'path' : _ref5$method,
        children = _ref5.children,
        props = _objectWithoutPropertiesLoose(_ref5, ["redirectTo", "active", "params", "method", "children"]);

    return active ? React.createElement(React.Fragment, null, children) : React.createElement(ReactRouterRedirect, _extends({
      to: _this.get(redirectTo)[method](method === 'data' && !params ? 'path' : params)
    }, props));
  });

  _defineProperty(this, "get", function (name) {
    return _this.names[name];
  });

  _defineProperty(this, "createFullPath", function (path, parentPath) {
    return (parentPath + "/" + path).replace(/\/{2,}/, '/').replace(/(?<=\w+)\/+$/, '');
  });

  _defineProperty(this, "build", function (routes,
  /*recursive param*/
  parentPath) {
    if (routes === void 0) {
      routes = [];
    }

    if (parentPath === void 0) {
      parentPath = '';
    }

    return routes.map(function (route) {
      var _routes = route.routes,
          path = route.path,
          name = route.name,
          redirectTo = route.redirectTo,
          component = route.component,
          render = route.render;

      var fullPath = _this.createFullPath(path, parentPath);

      route.path = fullPath;

      if (typeof redirectTo === 'string') {
        route.redirectTo = function () {
          var routeFromName = _this.get(redirectTo);

          return routeFromName ? routeFromName.path() : _this.createFullPath(redirectTo, parentPath);
        };
      }

      if (_routes) {
        route.routes = _this.build(_routes, path);

        if (!component && !render) {
          route.render = function (config) {
            return _this.render(route, config);
          };
        }
      }

      route.actions = {
        path: compile(fullPath),
        data: function data(prop) {
          return prop ? route[prop] : route;
        },
        is: function is(pathname) {
          return isMatch(pathname, fullPath);
        },
        routes: function routes(pathname, _temp) {
          var _ref6 = _temp === void 0 ? {} : _temp,
              strict = _ref6.strict;

          return _this.match(pathname, {
            name: _routes,
            strict: strict
          });
        },
        contains: function contains(pathname, _temp2) {
          var _ref7 = _temp2 === void 0 ? {} : _temp2,
              strict = _ref7.strict;

          return _this.contains(pathname, {
            name: _routes,
            strict: strict
          });
        }
      };

      if (name) {
        _this.names[name] = route.actions;
      }

      return route;
    });
  });

  _defineProperty(this, "render", function (_ref8, config) {
    var routes = _ref8.routes,
        _ref8$name = _ref8.name,
        parentName = _ref8$name === void 0 ? '' : _ref8$name;

    if (config === void 0) {
      config = {};
    }

    var _this$configuration$c4 = _extends({}, _this.configuration, config),
        _this$configuration$c5 = _this$configuration$c4.Switch,
        Switch = _this$configuration$c5 === void 0 ? DefaultSwitch : _this$configuration$c5,
        _this$configuration$c6 = _this$configuration$c4.Route,
        Route = _this$configuration$c6 === void 0 ? DefaultRoute : _this$configuration$c6,
        extraProps = _objectWithoutPropertiesLoose(_this$configuration$c4, ["Switch", "Route"]);

    return routes ? React.createElement(Switch, null, routes.map(function (route, i) {
      var name = route.name,
          path = route.path,
          strict = route.strict,
          _render = route.render,
          redirectTo = route.redirectTo,
          routes = route.routes,
          _route$exact = route.exact,
          exact = _route$exact === void 0 ? !routes : _route$exact,
          Component = route.component;
      return React.createElement(Route, {
        key: parentName + "(" + (name || i) + ")",
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

          return redirectTo ? typeof redirectTo === 'function' ? redirectTo(componentProps) : React.createElement(_this.Redirect, redirectTo) : Component ? React.createElement(Component, componentProps) : _render(componentProps);
        }
      });
    })) : null;
  });

  _defineProperty(this, "match", function (pathname, _temp3) {
    var _ref9 = _temp3 === void 0 ? {} : _temp3,
        name = _ref9.name,
        _ref9$strict = _ref9.strict,
        strict = _ref9$strict === void 0 ? true : _ref9$strict;

    switch (typeof name) {
      case 'string':
        var _this$get$data = _this.get(name).data(),
            routes = _this$get$data.routes,
            path = _this$get$data.path;

        if (routes) {
          return matchRoutes(routes, strict ? pathname : path + "/" + trimStart(pathname, '/'));
        }

        return [];

      case 'object':
        return matchRoutes(name, pathname);

      default:
        return matchRoutes(_this.routes, pathname);
    }
  });

  _defineProperty(this, "contains", function (pathname, _temp4) {
    var _ref10 = _temp4 === void 0 ? {} : _temp4,
        name = _ref10.name,
        strict = _ref10.strict;

    return !!_this.match(pathname, {
      name: name,
      strict: strict
    }).length;
  });

  this.use(_config);
};
export default new AnewRouter();