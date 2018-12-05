'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = annotate;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Copyright 2017 Shape Security, Inc.
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

function insertInto(annotations, index, text, afterExisting) {
  for (var i = 0; i < annotations.length; ++i) {
    if (annotations[i].index >= index) {
      if (afterExisting) {
        while (i < annotations.length && annotations[i].index === index) {
          ++i;
        }
      }

      annotations.splice(i, 0, { index, text });
      return;
    }
  }
  annotations.push({ index, text });
}

class Info {
  constructor() {
    this.declares = [];
    this.reads = [];
    this.writes = [];
    this.deletes = [];
    this.scopes = [];
  }
}

class DefaultMap extends Map {
  constructor(thunk) {
    super();
    this.thunk = thunk;
  }

  get(v) {
    if (!this.has(v)) {
      this.set(v, this.thunk());
    }
    return super.get(v);
  }
}

function annotate(_ref) {
  var source = _ref.source,
      locations = _ref.locations,
      globalScope = _ref.globalScope,
      _ref$skipUnambiguous = _ref.skipUnambiguous,
      skipUnambiguous = _ref$skipUnambiguous === undefined ? false : _ref$skipUnambiguous,
      _ref$skipScopes = _ref.skipScopes,
      skipScopes = _ref$skipScopes === undefined ? false : _ref$skipScopes;


  var nodeInfo = new DefaultMap(function () {
    return new Info();
  });

  var vars = new DefaultMap(function () {
    return [];
  }); // MultiMap, I guess?

  function addVariable(v) {
    vars.get(v.name).push(v);
    v.declarations.forEach(function (d) {
      nodeInfo.get(d.node).declares.push(v);
    });
    v.references.forEach(function (r) {
      var info = nodeInfo.get(r.node);
      if (r.accessibility.isDelete) {
        if (r.accessibility.isRead || r.accessibility.isWrite) {
          throw new Error('some reference is a delete *and* something else');
        }
        info.deletes.push(v);
      } else {
        if (r.accessibility.isRead) {
          info.reads.push(v);
        }
        if (r.accessibility.isWrite) {
          info.writes.push(v);
        }
      }
    });
  }

  (function visit(scope) {
    if (!skipScopes) nodeInfo.get(scope.astNode).scopes.push(scope);
    scope.variables.forEach(addVariable);
    scope.children.forEach(visit);
  })(globalScope);

  // an annotation is { index, text }
  var annotations = [];

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = nodeInfo.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _ref2 = _step.value;

      var _ref3 = _slicedToArray(_ref2, 2);

      var node = _ref3[0];
      var info = _ref3[1];

      var location = locations.get(node);
      if (info.scopes.length > 0) {
        if (info.declares.length !== 0 || info.reads.length !== 0 || info.writes.length !== 0 || info.deletes.length !== 0) {
          throw new Error('unhandled condition: node is scope and reference');
        }

        var _arr = [].concat(_toConsumableArray(info.scopes));

        for (var _i = 0; _i < _arr.length; _i++) {
          var scope = _arr[_i];
          var scopeVars = [].concat(_toConsumableArray(scope.variables.values()));
          var _text = 'Scope (' + scope.type.name + ')';
          if (scopeVars.length > 0) {
            _text += ' declaring ' + scopeVars.map(function (v) {
              return v.name + '#' + vars.get(v.name).indexOf(v);
            }).join(', ');
          }
          insertInto(annotations, location.start.offset, '/* ' + _text + ' */', true);
          insertInto(annotations, location.end.offset, '/* end scope */', true);
        }
      } else if (info.deletes.length > 0) {
        var deletes = skipUnambiguous ? info.deletes.filter(function (v) {
          return vars.get(v.name).length > 1;
        }) : info.deletes;
        if (deletes.length > 0) {
          insertInto(annotations, location.end.offset, '/* deletes ' + deletes.map(function (v) {
            return v.name + '#' + vars.get(v.name).indexOf(v);
          }).join(', ') + ' */', false);
        }
      } else {
        var _text2 = '';
        var declares = skipUnambiguous ? info.declares.filter(function (v) {
          return vars.get(v.name).length > 1;
        }) : info.declares;
        if (declares.length > 0) {
          _text2 += 'declares ' + declares.map(function (v) {
            return v.name + '#' + vars.get(v.name).indexOf(v);
          }).join(', ');
        }
        var reads = skipUnambiguous ? info.reads.filter(function (v) {
          return vars.get(v.name).length > 1;
        }) : info.reads;
        if (reads.length > 0) {
          if (_text2.length > 0) _text2 += '; ';
          _text2 += 'reads ' + reads.map(function (v) {
            return v.name + '#' + vars.get(v.name).indexOf(v);
          }).join(', ');
        }
        var writes = skipUnambiguous ? info.writes.filter(function (v) {
          return vars.get(v.name).length > 1;
        }) : info.writes;
        if (writes.length > 0) {
          if (_text2.length > 0) _text2 += '; ';
          _text2 += 'writes ' + writes.map(function (v) {
            return v.name + '#' + vars.get(v.name).indexOf(v);
          }).join(', ');
        }
        if (_text2 !== '') {
          insertInto(annotations, location.end.offset, '/* ' + _text2 + ' */', false);
        }
      }
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

  var out = '';
  var previousIndex = 0;
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = annotations[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _ref4 = _step2.value;
      var index = _ref4.index;
      var text = _ref4.text;

      out += source.substring(previousIndex, index) + text;
      previousIndex = index;
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

  out += source.substring(previousIndex);
  return out;
}