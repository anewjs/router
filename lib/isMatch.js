'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = isMatch;

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isMatch(compiledPathname, sourcePathname) {
    if (sourcePathname === null) {
        return false;
    }

    var routeRegEx = (0, _pathToRegexp2.default)(sourcePathname);

    return !!compiledPathname.match(routeRegEx);
}