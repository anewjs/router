'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createRouteChainMetods;

var _isMatch = require('./isMatch');

var _isMatch2 = _interopRequireDefault(_isMatch);

var _pathToRegexp = require('path-to-regexp');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createRouteChainMetods(context, name, path, route) {
    return {
        path: (0, _pathToRegexp.compile)(path),
        data: function data(prop) {
            return prop ? route[prop] : route;
        },
        routes: function routes(pathname) {
            var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                strict = _ref.strict;

            return context.match(pathname, { name: name, strict: strict });
        },
        contains: function contains(pathname) {
            var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                strict = _ref2.strict;

            return context.contains(pathname, { name: name, strict: strict });
        },
        is: function is(pathname) {
            return (0, _isMatch2.default)(pathname, path);
        }
    };
}