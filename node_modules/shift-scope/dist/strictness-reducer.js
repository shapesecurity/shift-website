'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _shiftReducer = require('shift-reducer');

var _shiftReducer2 = _interopRequireDefault(_shiftReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO this file should live elsewhere

class SetMonoid {
  // nb not immutable
  constructor(set) {
    this.set = set;
  }

  static empty() {
    return new SetMonoid(new Set());
  }

  concat(b) {
    return new SetMonoid(merge(this.set, b.set));
  }

  extract() {
    return this.set;
  }

  add(e) {
    // this happens to work, since, as used in StrictnessReducer, .add is never called until after something has been merged, so the identity element is never mutated.
    // to do this in an immutable fashion, uncomment the line below. 
    // this.set = merge(new Set, this.set);
    this.set.add(e);
    return this;
  }
}

function hasStrict(directives) {
  return directives.some(function (d) {
    return d.rawValue === 'use strict';
  });
}

function merge(s1, s2) {
  var out = new Set();
  s1.forEach(function (v) {
    return out.add(v);
  });
  s2.forEach(function (v) {
    return out.add(v);
  });
  return out;
}

// Given a Script, the analyze method returns a set containing all ArrowExpression, FunctionDeclaration, FunctionExpression, and Script nodes which are sloppy mode. All other ArrowExpression, FunctionDeclaration, FunctionExpression, and Script nodes are strict.
class StrictnessReducer extends _shiftReducer.MonoidalReducer {
  constructor() {
    super(SetMonoid);
  }

  static analyze(script) {
    return (0, _shiftReducer2.default)(new this(), script).extract();
  }

  reduceArrowExpression(node, _ref) {
    var params = _ref.params,
        body = _ref.body;

    if (node.body.type === 'FunctionBody' && hasStrict(node.body.directives)) {
      return SetMonoid.empty();
    }
    return super.reduceArrowExpression(node, { params, body }).add(node);
  }

  reduceClassDeclaration() {
    return SetMonoid.empty();
  }

  reduceClassExpression() {
    return SetMonoid.empty();
  }

  reduceFunctionDeclaration(node, _ref2) {
    var name = _ref2.name,
        params = _ref2.params,
        body = _ref2.body;

    if (hasStrict(node.body.directives)) {
      return SetMonoid.empty();
    }
    return super.reduceFunctionDeclaration(node, { name, params, body }).add(node);
  }

  reduceFunctionExpression(node, _ref3) {
    var name = _ref3.name,
        params = _ref3.params,
        body = _ref3.body;

    if (hasStrict(node.body.directives)) {
      return SetMonoid.empty();
    }
    return super.reduceFunctionExpression(node, { name, params, body }).add(node);
  }

  reduceGetter(node, _ref4) {
    var name = _ref4.name,
        body = _ref4.body;

    if (hasStrict(node.body.directives)) {
      return SetMonoid.empty();
    }
    return super.reduceGetter(node, { name, body }).add(node);
  }

  reduceMethod(node, _ref5) {
    var name = _ref5.name,
        params = _ref5.params,
        body = _ref5.body;

    if (hasStrict(node.body.directives)) {
      return SetMonoid.empty();
    }
    return super.reduceMethod(node, { name, params, body }).add(node);
  }

  reduceScript(node, _ref6) {
    var directives = _ref6.directives,
        statements = _ref6.statements;

    if (hasStrict(node.directives)) {
      return SetMonoid.empty();
    }
    return super.reduceScript(node, { directives, statements }).add(node);
  }

  reduceSetter(node, _ref7) {
    var name = _ref7.name,
        param = _ref7.param,
        body = _ref7.body;

    if (hasStrict(node.body.directives)) {
      return SetMonoid.empty();
    }
    return super.reduceSetter(node, { name, param, body }).add(node);
  }
}
exports.default = StrictnessReducer;