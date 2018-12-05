'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serialize = exports.Accessibility = exports.DeclarationType = exports.ScopeType = exports.annotate = exports.ScopeLookup = undefined;

var _scopeLookup = require('./scope-lookup');

Object.defineProperty(exports, 'ScopeLookup', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_scopeLookup).default;
  }
});

var _annotateSource = require('./annotate-source');

Object.defineProperty(exports, 'annotate', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_annotateSource).default;
  }
});

var _scope = require('./scope');

Object.defineProperty(exports, 'ScopeType', {
  enumerable: true,
  get: function get() {
    return _scope.ScopeType;
  }
});

var _declaration = require('./declaration');

Object.defineProperty(exports, 'DeclarationType', {
  enumerable: true,
  get: function get() {
    return _declaration.DeclarationType;
  }
});

var _reference = require('./reference');

Object.defineProperty(exports, 'Accessibility', {
  enumerable: true,
  get: function get() {
    return _reference.Accessibility;
  }
});

var _scopeSerializer = require('./scope-serializer');

Object.defineProperty(exports, 'serialize', {
  enumerable: true,
  get: function get() {
    return _scopeSerializer.serialize;
  }
});
exports.default = analyze;

var _scopeAnalyzer = require('./scope-analyzer');

var _scopeAnalyzer2 = _interopRequireDefault(_scopeAnalyzer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function analyze(script) {
  return _scopeAnalyzer2.default.analyze(script);
}