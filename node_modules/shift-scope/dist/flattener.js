'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _shiftReducer = require('shift-reducer');

var _shiftReducer2 = _interopRequireDefault(_shiftReducer);

var _shiftSpec = require('shift-spec');

var _shiftSpec2 = _interopRequireDefault(_shiftSpec);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO this file should live elsewhere

/**
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

class ListMonoid {
  constructor(list) {
    this.list = list;
  }

  static empty() {
    return new ListMonoid([]);
  }

  concat(b) {
    return new ListMonoid(this.list.concat(b.list));
  }

  extract() {
    return this.list;
  }
}

// Gives a flat list of all nodes rooted at the given node, in preorder: that is, a node appears before its children.
class Flattener extends _shiftReducer.MonoidalReducer {
  // We explicitly invoke Monoidal.prototype methods so that we can automatically generate methods from the spec.
  constructor() {
    super(ListMonoid);
  }

  static flatten(node) {
    return (0, _shiftReducer2.default)(new this(), node).extract();
  }
}

exports.default = Flattener;

var _loop = function _loop(typeName) {
  Object.defineProperty(Flattener.prototype, `reduce${typeName}`, {
    value(node, state) {
      return new ListMonoid([node]).concat(_shiftReducer.MonoidalReducer.prototype[`reduce${typeName}`].call(this, node, state));
    }
  });
};

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = Object.keys(_shiftSpec2.default)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var typeName = _step.value;

    _loop(typeName);
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