'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _routerCore = require('./routerCore');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_routerCore).default;
  }
});
Object.defineProperty(exports, 'RouterCore', {
  enumerable: true,
  get: function get() {
    return _routerCore.RouterCore;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }