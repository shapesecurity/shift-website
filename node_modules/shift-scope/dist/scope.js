'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GlobalScope = exports.Scope = exports.ScopeType = undefined;

var _variable = require('./variable');

var _variable2 = _interopRequireDefault(_variable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ScopeType {
  constructor(name) {
    this.name = name;
  }
}

exports.ScopeType = ScopeType; /**
                                * Copyright 2015 Shape Security, Inc.
                                *
                                * Licensed under the Apache License, Version 2.0 (the "License")
                                * you may not use this file except in compliance with the License.
                                * You may obtain a copy of the License at
                                *
                                *     http://www.apache.org/licenses/LICENSE-2.0
                                *
                                * Unless required by applicable law or agreed to in writing, software
                                * distributed under the License is distributed on an "AS IS" BASIS,
                                * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                * See the License for the specific language governing permissions and
                                * limitations under the License.
                                */

ScopeType.GLOBAL = new ScopeType('Global');
ScopeType.MODULE = new ScopeType('Module');
ScopeType.SCRIPT = new ScopeType('Script');
ScopeType.ARROW_FUNCTION = new ScopeType('ArrowFunction');
ScopeType.FUNCTION = new ScopeType('Function');
ScopeType.FUNCTION_NAME = new ScopeType('FunctionName'); // named function expressions
ScopeType.CLASS_NAME = new ScopeType('ClassName'); // named class expressions
ScopeType.PARAMETERS = new ScopeType('Parameters');
ScopeType.PARAMETER_EXPRESSION = new ScopeType('ParameterExpression');
ScopeType.WITH = new ScopeType('With');
ScopeType.CATCH = new ScopeType('Catch');
ScopeType.BLOCK = new ScopeType('Block');

class Scope {
  constructor(_ref) {
    var _this = this;

    var children = _ref.children,
        variables = _ref.variables,
        through = _ref.through,
        type = _ref.type,
        isDynamic = _ref.isDynamic,
        astNode = _ref.astNode;

    this.children = children;
    this.through = through;
    this.type = type;
    this.astNode = astNode;

    this.variables = new Map();
    variables.forEach(function (v) {
      return _this.variables.set(v.name, v);
    });

    this.variableList = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.variables.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var x = _step.value;

        this.variableList.push(x);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    this.dynamic = isDynamic || type === ScopeType.WITH || type === ScopeType.GLOBAL;
  }

  isGlobal() {
    return this.type === ScopeType.GLOBAL;
  }

  lookupVariable(name) {
    return this.variables.get(name);
  }
}

exports.Scope = Scope;
class GlobalScope extends Scope {
  constructor(_ref2) {
    var _this2;

    var children = _ref2.children,
        variables = _ref2.variables,
        through = _ref2.through,
        astNode = _ref2.astNode;

    _this2 = super({ children, variables, through, type: ScopeType.GLOBAL, isDynamic: true, astNode });
    through.forEachEntry(function (v, k) {
      _this2.variables.set(k, new _variable2.default(k, v, []));
    });
    this.variableList = [];
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = this.variables.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var x = _step2.value;

        this.variableList.push(x);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }
}
exports.GlobalScope = GlobalScope;