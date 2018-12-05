'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _multimap = require('multimap');

var _multimap2 = _interopRequireDefault(_multimap);

var _shiftReducer = require('shift-reducer');

var _shiftReducer2 = _interopRequireDefault(_shiftReducer);

var _scopeState = require('./scope-state');

var _scopeState2 = _interopRequireDefault(_scopeState);

var _reference = require('./reference');

var _declaration = require('./declaration');

var _scope = require('./scope');

var _strictnessReducer = require('./strictness-reducer');

var _strictnessReducer2 = _interopRequireDefault(_strictnessReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
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

function getFunctionDeclarations(statements) {
  return statements.filter(function (s) {
    return s.type === 'FunctionDeclaration';
  }).map(function (f) {
    return f.name;
  });
}

class ScopeAnalyzer extends _shiftReducer.MonoidalReducer {
  constructor(program) {
    super(_scopeState2.default);
    this.sloppySet = program.type === 'Script' ? _strictnessReducer2.default.analyze(program) : new Set();
  }

  static analyze(program) {
    return (0, _shiftReducer2.default)(new this(program), program).children[0];
  }

  finishFunction(fnNode, params, body) {
    var isArrowFn = fnNode.type === 'ArrowExpression';
    var fnType = isArrowFn ? _scope.ScopeType.ARROW_FUNCTION : _scope.ScopeType.FUNCTION;
    var opts = { shouldResolveArguments: !isArrowFn, shouldB33: this.sloppySet.has(fnNode) };
    if (params.hasParameterExpressions) {
      return params.withoutParameterExpressions().concat(body.finish(fnNode, fnType, { isFunctionWithParameterExpressions: true })).finish(fnNode, _scope.ScopeType.PARAMETERS, opts);
    }
    return params.concat(body).finish(fnNode, fnType, opts);
  }

  reduceArrowExpression(node, _ref) {
    var params = _ref.params,
        body = _ref.body;

    return this.finishFunction(node, params, body);
  }

  reduceAssignmentExpression(node, _ref2) {
    var binding = _ref2.binding,
        expression = _ref2.expression;

    return super.reduceAssignmentExpression(node, {
      binding: binding.addReferences(_reference.Accessibility.WRITE),
      expression
    });
  }

  reduceAssignmentTargetIdentifier(node) {
    return new _scopeState2.default({ atsForParent: [node] });
  }

  reduceBindingIdentifier(node) {
    if (node.name === '*default*') {
      return new _scopeState2.default();
    }
    return new _scopeState2.default({ bindingsForParent: [node] });
  }

  reduceBindingPropertyIdentifier(node, _ref3) {
    var binding = _ref3.binding,
        init = _ref3.init;

    var s = super.reduceBindingPropertyIdentifier(node, { binding, init });
    if (init) {
      return s.withParameterExpressions();
    }
    return s;
  }

  reduceBindingWithDefault(node, _ref4) {
    var binding = _ref4.binding,
        init = _ref4.init;

    return super.reduceBindingWithDefault(node, { binding, init }).withParameterExpressions();
  }

  reduceBlock(node, _ref5) {
    var statements = _ref5.statements;

    return super.reduceBlock(node, { statements }).withPotentialVarFunctions(getFunctionDeclarations(node.statements)).finish(node, _scope.ScopeType.BLOCK);
  }

  reduceCallExpression(node, _ref6) {
    var callee = _ref6.callee,
        _arguments = _ref6.arguments;

    var s = super.reduceCallExpression(node, { callee, arguments: _arguments });
    if (node.callee.type === 'IdentifierExpression' && node.callee.name === 'eval') {
      return s.taint();
    }
    return s;
  }

  reduceCatchClause(node, _ref7) {
    var binding = _ref7.binding,
        body = _ref7.body;

    return super.reduceCatchClause(node, {
      binding: binding.addDeclarations(_declaration.DeclarationType.CATCH_PARAMETER),
      body
    }).finish(node, _scope.ScopeType.CATCH);
  }

  reduceClassDeclaration(node, _ref8) {
    var name = _ref8.name,
        _super = _ref8.super,
        elements = _ref8.elements;

    var s = super.reduceClassDeclaration(node, { name, super: _super, elements }).addDeclarations(_declaration.DeclarationType.CLASS_NAME).finish(node, _scope.ScopeType.CLASS_NAME);
    return s.concat(name.addDeclarations(_declaration.DeclarationType.CLASS_DECLARATION));
  }

  reduceClassExpression(node, _ref9) {
    var name = _ref9.name,
        _super = _ref9.super,
        elements = _ref9.elements;

    return super.reduceClassExpression(node, { name, super: _super, elements }).addDeclarations(_declaration.DeclarationType.CLASS_NAME).finish(node, _scope.ScopeType.CLASS_NAME);
  }

  reduceCompoundAssignmentExpression(node, _ref10) {
    var binding = _ref10.binding,
        expression = _ref10.expression;

    return super.reduceCompoundAssignmentExpression(node, {
      binding: binding.addReferences(_reference.Accessibility.READWRITE),
      expression
    });
  }

  reduceComputedMemberExpression(node, _ref11) {
    var object = _ref11.object,
        expression = _ref11.expression;

    return super.reduceComputedMemberExpression(node, { object, expression }).withParameterExpressions();
  }

  reduceForInStatement(node, _ref12) {
    var left = _ref12.left,
        right = _ref12.right,
        body = _ref12.body;

    return super.reduceForInStatement(node, { left: left.addReferences(_reference.Accessibility.WRITE), right, body }).finish(node, _scope.ScopeType.BLOCK);
  }

  reduceForOfStatement(node, _ref13) {
    var left = _ref13.left,
        right = _ref13.right,
        body = _ref13.body;

    return super.reduceForOfStatement(node, { left: left.addReferences(_reference.Accessibility.WRITE), right, body }).finish(node, _scope.ScopeType.BLOCK);
  }

  reduceForStatement(node, _ref14) {
    var init = _ref14.init,
        test = _ref14.test,
        update = _ref14.update,
        body = _ref14.body;

    return super.reduceForStatement(node, {
      init: init ? init.withoutBindingsForParent() : init,
      test,
      update,
      body
    }).finish(node, _scope.ScopeType.BLOCK);
  }

  reduceFormalParameters(node, _ref15) {
    var items = _ref15.items,
        rest = _ref15.rest;

    var s = rest ? rest : new _scopeState2.default();
    items.forEach(function (item, ind) {
      s = s.concat(item.hasParameterExpressions ? item.finish(node.items[ind], _scope.ScopeType.PARAMETER_EXPRESSION) : item);
    });
    return s.addDeclarations(_declaration.DeclarationType.PARAMETER);
  }

  reduceFunctionDeclaration(node, _ref16) {
    var name = _ref16.name,
        params = _ref16.params,
        body = _ref16.body;

    return name.concat(this.finishFunction(node, params, body)).addFunctionDeclaration();
  }

  reduceFunctionExpression(node, _ref17) {
    var name = _ref17.name,
        params = _ref17.params,
        body = _ref17.body;

    var s = this.finishFunction(node, params, body);
    if (name) {
      return name.concat(s).addDeclarations(_declaration.DeclarationType.FUNCTION_NAME).finish(node, _scope.ScopeType.FUNCTION_NAME);
    }
    return s;
  }

  reduceGetter(node, _ref18) {
    var name = _ref18.name,
        body = _ref18.body;

    return name.concat(body.finish(node, _scope.ScopeType.FUNCTION, {
      shouldResolveArguments: true,
      shouldB33: this.sloppySet.has(node)
    }));
  }

  reduceIdentifierExpression(node) {
    return new _scopeState2.default({
      freeIdentifiers: new _multimap2.default([[node.name, new _reference.Reference(node, _reference.Accessibility.READ)]])
    });
  }

  reduceIfStatement(node, _ref19) {
    var test = _ref19.test,
        consequent = _ref19.consequent,
        alternate = _ref19.alternate;

    var pvsfd = [];
    if (node.consequent.type === 'FunctionDeclaration') {
      pvsfd.push(node.consequent.name);
    }
    if (node.alternate && node.alternate.type === 'FunctionDeclaration') {
      pvsfd.push(node.alternate.name);
    }
    return super.reduceIfStatement(node, { test, consequent, alternate }).withPotentialVarFunctions(pvsfd);
  }

  reduceImport(node, _ref20) {
    var moduleSpecifier = _ref20.moduleSpecifier,
        defaultBinding = _ref20.defaultBinding,
        namedImports = _ref20.namedImports;

    return super.reduceImport(node, { moduleSpecifier, defaultBinding, namedImports }).addDeclarations(_declaration.DeclarationType.IMPORT);
  }

  reduceMethod(node, _ref21) {
    var name = _ref21.name,
        params = _ref21.params,
        body = _ref21.body;

    return name.concat(this.finishFunction(node, params, body));
  }

  reduceModule(node, _ref22) {
    var directives = _ref22.directives,
        items = _ref22.items;

    return super.reduceModule(node, { directives, items }).finish(node, _scope.ScopeType.MODULE);
  }

  reduceScript(node, _ref23) {
    var directives = _ref23.directives,
        statements = _ref23.statements;

    return super.reduceScript(node, { directives, statements }).finish(node, _scope.ScopeType.SCRIPT, { shouldB33: !node.directives.some(function (d) {
        return d.rawValue === 'use strict';
      }) });
  }

  reduceSetter(node, _ref24) {
    var name = _ref24.name,
        param = _ref24.param,
        body = _ref24.body;

    if (param.hasParameterExpressions) {
      param = param.finish(node, _scope.ScopeType.PARAMETER_EXPRESSION);
    }
    return name.concat(this.finishFunction(node, param.addDeclarations(_declaration.DeclarationType.PARAMETER), body));
  }

  reduceSwitchStatement(node, _ref25) {
    var discriminant = _ref25.discriminant,
        cases = _ref25.cases;

    return this.fold(cases).finish(node, _scope.ScopeType.BLOCK).withPotentialVarFunctions(getFunctionDeclarations([].concat(_toConsumableArray(node.cases.map(function (c) {
      return c.consequent;
    }))))).concat(discriminant);
  }

  reduceSwitchStatementWithDefault(node, _ref26) {
    var discriminant = _ref26.discriminant,
        preDefaultCases = _ref26.preDefaultCases,
        defaultCase = _ref26.defaultCase,
        postDefaultCases = _ref26.postDefaultCases;

    var functionDeclarations = getFunctionDeclarations([].concat(_toConsumableArray(node.preDefaultCases.concat([node.defaultCase], node.postDefaultCases).map(function (c) {
      return c.consequent;
    }))));
    var cases = preDefaultCases.concat([defaultCase], postDefaultCases);
    return this.fold(cases).finish(node, _scope.ScopeType.BLOCK).withPotentialVarFunctions(functionDeclarations).concat(discriminant);
  }

  reduceUnaryExpression(node, _ref27) {
    var operand = _ref27.operand;

    if (node.operator === 'delete' && node.operand.type === 'IdentifierExpression') {
      // 'delete x' is a special case.
      return new _scopeState2.default({ freeIdentifiers: new _multimap2.default([[node.operand.name, new _reference.Reference(node.operand, _reference.Accessibility.DELETE)]]) });
    }
    return super.reduceUnaryExpression(node, { operand });
  }

  reduceUpdateExpression(node, _ref28) {
    var operand = _ref28.operand;

    return operand.addReferences(_reference.Accessibility.READWRITE);
  }

  reduceVariableDeclaration(node, _ref29) {
    var declarators = _ref29.declarators;

    return super.reduceVariableDeclaration(node, { declarators }).addDeclarations(_declaration.DeclarationType.fromVarDeclKind(node.kind), true);
    // passes bindingsForParent up, for for-in and for-of to add their write-references
  }

  reduceVariableDeclarationStatement(node, _ref30) {
    var declaration = _ref30.declaration;

    return declaration.withoutBindingsForParent();
  }

  reduceVariableDeclarator(node, _ref31) {
    var binding = _ref31.binding,
        init = _ref31.init;

    var s = super.reduceVariableDeclarator(node, { binding, init });
    if (init) {
      return s.addReferences(_reference.Accessibility.WRITE, true);
    }
    return s;
  }

  reduceWithStatement(node, _ref32) {
    var object = _ref32.object,
        body = _ref32.body;

    return super.reduceWithStatement(node, { object, body: body.finish(node, _scope.ScopeType.WITH) });
  }
}
exports.default = ScopeAnalyzer;