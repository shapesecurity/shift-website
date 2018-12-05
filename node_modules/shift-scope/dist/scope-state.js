'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _multimap = require('multimap');

var _multimap2 = _interopRequireDefault(_multimap);

var _declaration = require('./declaration');

var _reference = require('./reference');

var _scope = require('./scope');

var _variable = require('./variable');

var _variable2 = _interopRequireDefault(_variable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function merge(multiMap, otherMultiMap) {
  otherMultiMap.forEachEntry(function (v, k) {
    multiMap.set.apply(multiMap, [k].concat(v));
  });
  return multiMap;
} /**
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

function resolveDeclarations(freeIdentifiers, decls, variables) {
  decls.forEachEntry(function (declarations, name) {
    var references = freeIdentifiers.get(name) || [];
    variables = variables.concat(new _variable2.default(name, references, declarations));
    freeIdentifiers.delete(name);
  });
  return variables;
}

class ScopeState {
  constructor() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$freeIdentifiers = _ref.freeIdentifiers,
        freeIdentifiers = _ref$freeIdentifiers === undefined ? new _multimap2.default() : _ref$freeIdentifiers,
        _ref$functionScopedDe = _ref.functionScopedDeclarations,
        functionScopedDeclarations = _ref$functionScopedDe === undefined ? new _multimap2.default() : _ref$functionScopedDe,
        _ref$blockScopedDecla = _ref.blockScopedDeclarations,
        blockScopedDeclarations = _ref$blockScopedDecla === undefined ? new _multimap2.default() : _ref$blockScopedDecla,
        _ref$functionDeclarat = _ref.functionDeclarations,
        functionDeclarations = _ref$functionDeclarat === undefined ? new _multimap2.default() : _ref$functionDeclarat,
        _ref$children = _ref.children,
        children = _ref$children === undefined ? [] : _ref$children,
        _ref$dynamic = _ref.dynamic,
        dynamic = _ref$dynamic === undefined ? false : _ref$dynamic,
        _ref$bindingsForParen = _ref.bindingsForParent,
        bindingsForParent = _ref$bindingsForParen === undefined ? [] : _ref$bindingsForParen,
        _ref$atsForParent = _ref.atsForParent,
        atsForParent = _ref$atsForParent === undefined ? [] : _ref$atsForParent,
        _ref$potentiallyVarSc = _ref.potentiallyVarScopedFunctionDeclarations,
        potentiallyVarScopedFunctionDeclarations = _ref$potentiallyVarSc === undefined ? new _multimap2.default() : _ref$potentiallyVarSc,
        _ref$hasParameterExpr = _ref.hasParameterExpressions,
        hasParameterExpressions = _ref$hasParameterExpr === undefined ? false : _ref$hasParameterExpr;

    this.freeIdentifiers = freeIdentifiers;
    this.functionScopedDeclarations = functionScopedDeclarations;
    this.blockScopedDeclarations = blockScopedDeclarations;
    this.functionDeclarations = functionDeclarations;
    this.children = children;
    this.dynamic = dynamic;
    this.bindingsForParent = bindingsForParent;
    this.atsForParent = atsForParent;
    this.potentiallyVarScopedFunctionDeclarations = potentiallyVarScopedFunctionDeclarations;
    this.hasParameterExpressions = hasParameterExpressions;
  }

  static empty() {
    return new ScopeState({});
  }

  /*
   * Monoidal append: merges the two states together
   */
  concat(b) {
    if (this === b) {
      return this;
    }
    return new ScopeState({
      freeIdentifiers: merge(merge(new _multimap2.default(), this.freeIdentifiers), b.freeIdentifiers),
      functionScopedDeclarations: merge(merge(new _multimap2.default(), this.functionScopedDeclarations), b.functionScopedDeclarations),
      blockScopedDeclarations: merge(merge(new _multimap2.default(), this.blockScopedDeclarations), b.blockScopedDeclarations),
      functionDeclarations: merge(merge(new _multimap2.default(), this.functionDeclarations), b.functionDeclarations),
      children: this.children.concat(b.children),
      dynamic: this.dynamic || b.dynamic,
      bindingsForParent: this.bindingsForParent.concat(b.bindingsForParent),
      atsForParent: this.atsForParent.concat(b.atsForParent),
      potentiallyVarScopedFunctionDeclarations: merge(merge(new _multimap2.default(), this.potentiallyVarScopedFunctionDeclarations), b.potentiallyVarScopedFunctionDeclarations),
      hasParameterExpressions: this.hasParameterExpressions || b.hasParameterExpressions
    });
  }

  /*
   * Observe variables entering scope
   */
  addDeclarations(kind) {
    var keepBindingsForParent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var declMap = new _multimap2.default();
    merge(declMap, kind.isBlockScoped ? this.blockScopedDeclarations : this.functionScopedDeclarations);
    this.bindingsForParent.forEach(function (binding) {
      return declMap.set(binding.name, new _declaration.Declaration(binding, kind));
    });
    var s = new ScopeState(this);
    if (kind.isBlockScoped) {
      s.blockScopedDeclarations = declMap;
    } else {
      s.functionScopedDeclarations = declMap;
    }
    if (!keepBindingsForParent) {
      s.bindingsForParent = [];
      s.atsForParent = [];
    }
    return s;
  }

  addFunctionDeclaration() {
    if (this.bindingsForParent.length === 0) {
      return this; // i.e., this function declaration is `export default function () {...}`
    }
    var binding = this.bindingsForParent[0];
    var s = new ScopeState(this);
    merge(s.functionDeclarations, new _multimap2.default([[binding.name, new _declaration.Declaration(binding, _declaration.DeclarationType.FUNCTION_DECLARATION)]]));
    s.bindingsForParent = [];
    return s;
  }

  /*
   * Observe a reference to a variable
   */
  addReferences(accessibility) {
    var keepBindingsForParent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var freeMap = new _multimap2.default();
    merge(freeMap, this.freeIdentifiers);
    this.bindingsForParent.forEach(function (binding) {
      return freeMap.set(binding.name, new _reference.Reference(binding, accessibility));
    });
    this.atsForParent.forEach(function (binding) {
      return freeMap.set(binding.name, new _reference.Reference(binding, accessibility));
    });
    var s = new ScopeState(this);
    s.freeIdentifiers = freeMap;
    if (!keepBindingsForParent) {
      s.bindingsForParent = [];
      s.atsForParent = [];
    }
    return s;
  }

  taint() {
    var s = new ScopeState(this);
    s.dynamic = true;
    return s;
  }

  withoutBindingsForParent() {
    var s = new ScopeState(this);
    s.bindingsForParent = [];
    return s;
  }

  withParameterExpressions() {
    var s = new ScopeState(this);
    s.hasParameterExpressions = true;
    return s;
  }

  withoutParameterExpressions() {
    var s = new ScopeState(this);
    s.hasParameterExpressions = false;
    return s;
  }

  withPotentialVarFunctions(functions) {
    var pvsfd = merge(new _multimap2.default(), this.potentiallyVarScopedFunctionDeclarations);
    functions.forEach(function (f) {
      return pvsfd.set(f.name, new _declaration.Declaration(f, _declaration.DeclarationType.FUNCTION_VAR_DECLARATION));
    });
    var s = new ScopeState(this);
    s.potentiallyVarScopedFunctionDeclarations = pvsfd;
    return s;
  }

  /*
   * Used when a scope boundary is encountered. Resolves found free identifiers
   * and declarations into variable objects. Any free identifiers remaining are
   * carried forward into the new state object.
   */
  finish(astNode, scopeType) {
    var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref2$shouldResolveAr = _ref2.shouldResolveArguments,
        shouldResolveArguments = _ref2$shouldResolveAr === undefined ? false : _ref2$shouldResolveAr,
        _ref2$shouldB = _ref2.shouldB33,
        shouldB33 = _ref2$shouldB === undefined ? false : _ref2$shouldB,
        _ref2$isFunctionWithP = _ref2.isFunctionWithParameterExpressions,
        isFunctionWithParameterExpressions = _ref2$isFunctionWithP === undefined ? false : _ref2$isFunctionWithP;

    var variables = [];
    var functionScoped = new _multimap2.default();
    var freeIdentifiers = merge(new _multimap2.default(), this.freeIdentifiers);
    var pvsfd = merge(new _multimap2.default(), this.potentiallyVarScopedFunctionDeclarations);
    var children = this.children;

    var hasSimpleCatchBinding = scopeType.name === 'Catch' && astNode.binding.type === 'BindingIdentifier';
    this.blockScopedDeclarations.forEachEntry(function (v, k) {
      if (hasSimpleCatchBinding && v.length === 1 && v[0].node === astNode.binding) {
        // A simple catch binding is the only type of lexical binding which does *not* block B.3.3 hoisting.
        // See B.3.5: https://tc39.github.io/ecma262/#sec-variablestatements-in-catch-blocks
        return;
      }
      pvsfd.delete(k);
    });
    this.functionDeclarations.forEachEntry(function (v, k) {
      var existing = pvsfd.get(k);
      if (existing && (v.length > 1 || v[0].node !== existing[0].node)) {
        // Note that this is *currently* the spec'd behavior, but is regarded as a bug; see https://github.com/tc39/ecma262/issues/913
        pvsfd.delete(k);
      }
    });
    this.functionScopedDeclarations.forEachEntry(function (v, k) {
      var existing = pvsfd.get(k);
      if (existing && v.some(function (d) {
        return d.type === _declaration.DeclarationType.PARAMETER;
      })) {
        // Despite being function scoped, parameters *do* block B.3.3 hoisting.
        // See B.3.3.1.a.ii: https://tc39.github.io/ecma262/#sec-web-compat-functiondeclarationinstantiation
        // "If replacing the FunctionDeclaration f with a VariableStatement that has F as a BindingIdentifier would not produce any Early Errors for func and F is not an element of parameterNames, then"
        pvsfd.delete(k);
      }
    });

    var declarations = new _multimap2.default();

    switch (scopeType) {
      case _scope.ScopeType.BLOCK:
      case _scope.ScopeType.CATCH:
      case _scope.ScopeType.WITH:
      case _scope.ScopeType.FUNCTION_NAME:
      case _scope.ScopeType.CLASS_NAME:
      case _scope.ScopeType.PARAMETER_EXPRESSION:
        // resolve references to only block-scoped free declarations
        merge(declarations, this.blockScopedDeclarations);
        merge(declarations, this.functionDeclarations);
        variables = resolveDeclarations(freeIdentifiers, declarations, variables);
        merge(functionScoped, this.functionScopedDeclarations);
        break;
      case _scope.ScopeType.PARAMETERS:
      case _scope.ScopeType.ARROW_FUNCTION:
      case _scope.ScopeType.FUNCTION:
      case _scope.ScopeType.MODULE:
      case _scope.ScopeType.SCRIPT:
        // resolve references to both block-scoped and function-scoped free declarations

        // top-level lexical declarations in scripts are not globals, so create a separate scope for them
        // otherwise lexical and variable declarations go in the same scope.
        if (scopeType === _scope.ScopeType.SCRIPT) {
          children = [new _scope.Scope({
            children,
            variables: resolveDeclarations(freeIdentifiers, this.blockScopedDeclarations, []),
            through: merge(new _multimap2.default(), freeIdentifiers),
            type: _scope.ScopeType.SCRIPT,
            isDynamic: this.dynamic,
            astNode
          })];
        } else {
          merge(declarations, this.blockScopedDeclarations);
        }

        if (shouldResolveArguments) {
          declarations.set('arguments');
        }
        merge(declarations, this.functionScopedDeclarations);
        merge(declarations, this.functionDeclarations);

        if (shouldB33) {
          merge(declarations, pvsfd);
        }
        if (!isFunctionWithParameterExpressions) {
          pvsfd = new _multimap2.default();
        }

        variables = resolveDeclarations(freeIdentifiers, declarations, variables);

        // no declarations in a module are global
        if (scopeType === _scope.ScopeType.MODULE) {
          children = [new _scope.Scope({
            children,
            variables,
            through: freeIdentifiers,
            type: _scope.ScopeType.MODULE,
            isDynamic: this.dynamic,
            astNode
          })];
          variables = [];
        }
        break;
      default:
        throw new Error('not reached');
    }

    var scope = scopeType === _scope.ScopeType.SCRIPT || scopeType === _scope.ScopeType.MODULE ? new _scope.GlobalScope({ children, variables, through: freeIdentifiers, astNode }) : new _scope.Scope({
      children,
      variables,
      through: freeIdentifiers,
      type: scopeType,
      isDynamic: this.dynamic,
      astNode
    });

    return new ScopeState({
      freeIdentifiers,
      functionScopedDeclarations: functionScoped,
      children: [scope],
      bindingsForParent: this.bindingsForParent,
      potentiallyVarScopedFunctionDeclarations: pvsfd,
      hasParameterExpressions: this.hasParameterExpressions
    });
  }
}
exports.default = ScopeState;