"use strict";

// fn from http://underscorejs.org/docs/underscore.html
// https://github.com/jashkenas/underscore/blob/master/LICENSE
function debounce(func, wait, immediate) {
  var timeout, args, context, timestamp, result;

  var later = function() {
    var last = Date.now() - timestamp;

    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function() {
    context = this;
    args = arguments;
    timestamp = Date.now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

var editor = ace.edit(document.querySelector("#demo1 .editor"));

var error = document.querySelector("#demo1 .error-message");
var output = document.querySelector("#demo1 .output");
var outputContainer = document.querySelector("#demo1 .output-container");

var radio = document.querySelector("#script-radio");
var radio2 = document.querySelector("#module-radio");

function displayError(exception) {
  unhighlight();
  hideError();
  error.textContent = exception.message;
  if (exception.line) {
    editor.getSession().setAnnotations([{
      row: exception.line - 1,
      column: exception.column,
      text: exception.message,
      type: "error" // also warning and information
    }]);
  }
  outputContainer.classList.add("error");
}

function hideError() {
  outputContainer.classList.remove("error");
  editor.getSession().clearAnnotations();
}

function render(program) {
  hideError();
  output.innerHTML = program;
}

var session = editor.getSession();
editor.setBehavioursEnabled(false);
editor.setHighlightActiveLine(false);
editor.setOption("fontFamily", "Source Code Pro");
editor.setOption("fontSize", "10pt");
editor.setShowPrintMargin(false);
editor.setTheme("ace/theme/textmate");
editor.setWrapBehavioursEnabled(false);
session.setMode("ace/mode/javascript");
session.setOption("useWorker", false);
session.setTabSize(2);
session.setUseSoftTabs(true);
session.setUseWrapMode(false);

var params = {};
location.search.replace(/[?&](\w+)=([^&]*)/g, function(match, param, value){ params[param] = decodeURIComponent(value); });
if ({}.hasOwnProperty.call(params, 'code')) {
  if ({}.hasOwnProperty.call(params, 'type') && (params.type === 'Module' || params.type === 'Script')) {
    (params.type === 'Script' ? radio : radio2).checked = true;
  }
  session.setValue(decodeURIComponent(params.code));
}


var lookup;
var identifiers = [];

function setHighlight(identifier) {
  var variable = lookup.lookup(identifier);
  if (variable.length > 1) {
    displayError({message: 'This token refers to multiple variables.'});
    return;
  } else if (variable.length === 0) {
    displayError({message: 'Couldn\'t locate corresponding variable.'});
    return;
  }
  variable[0].declarations.forEach(function(decl) {
    var id = identifiers.indexOf(decl.node);
    var ele = document.querySelector('span[data-identifier=\'' + id + '\']');
    ele.classList.add('var-decl');
  });
  variable[0].references.forEach(function(ref) {
    var id = identifiers.indexOf(ref.node);
    var ele = document.querySelector('span[data-identifier=\'' + id + '\']');
    if (ref.accessibility.isRead) {
      ele.classList.add('var-read');
    }
    if (ref.accessibility.isWrite) {
      ele.classList.add('var-write');
    }
  });
}

function unhighlight() {
  hideError();
  var eles = document.querySelectorAll('#demo1 .var-decl');
  for (var i = 0; i < eles.length; ++i) {
    eles[i].classList.remove('var-decl');
  }
  eles = document.querySelectorAll('#demo1 .var-write');
  for (var i = 0; i < eles.length; ++i) {
    eles[i].classList.remove('var-write');
  }
  eles = document.querySelectorAll('#demo1 .var-read');
  for (var i = 0; i < eles.length; ++i) {
    eles[i].classList.remove('var-read');
  }
}

function mouseOverHandler(e) {
  var current = e.target;
  while (current && !(current.classList.contains('code-binding') || current.classList.contains('code-identifier'))) {
    current = current.parentElement;
  }
  if (current) {
    setHighlight(identifiers[current.dataset.identifier]);
  }
}
function mouseOutHandler(e) {
  unhighlight();
}
output.addEventListener("mouseover", mouseOverHandler);
output.addEventListener("mouseout", mouseOutHandler);

function escapeHTML(maybeString) {
  if (maybeString == null) {
    return maybeString;
  }
  return maybeString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function WebGen() {
  var webGen = new codegen.FormattedCodeGen;

  webGen.reduceDirective = function(node, obj) {
    node.rawValue = escapeHTML(node.rawValue);
    return codegen.FormattedCodeGen.prototype.reduceDirective.call(this, node, obj);
  }
  webGen.reduceImport = function(node, obj) {
    node.moduleSpecifier = escapeHTML(node.moduleSpecifier);
    return codegen.FormattedCodeGen.prototype.reduceImport.call(this, node, obj);
  }
  webGen.reduceImportNamespace = function(node, obj) {
    node.moduleSpecifier = escapeHTML(node.moduleSpecifier);
    return codegen.FormattedCodeGen.prototype.reduceImportNamespace.call(this, node, obj);
  }
  webGen.reduceExportAllFrom = function(node, obj) {
    node.moduleSpecifier = escapeHTML(node.moduleSpecifier);
    return codegen.FormattedCodeGen.prototype.reduceExportAllFrom.call(this, node, obj);
  }
  webGen.reduceExportFrom = function(node, obj) {
    node.moduleSpecifier = escapeHTML(node.moduleSpecifier);
    return codegen.FormattedCodeGen.prototype.reduceExportFrom.call(this, node, obj);
  }
  webGen.reduceLiteralRegExpExpression = function(node) {
    var rep = codegen.FormattedCodeGen.prototype.reduceLiteralRegExpExpression.call(this, node);
    rep.token = escapeHTML(rep.token);
    return rep;
  }
  webGen.reduceLiteralStringExpression = function(node) {
    var rep = codegen.FormattedCodeGen.prototype.reduceLiteralStringExpression.call(this, node);
    rep.token = escapeHTML(rep.token);
    return rep;
  };
  webGen.reduceTemplateExpression = function(node, obj) {
    for (var i = 0; i < node.elements.length; ++i) {
      if (node.elements[i].type === "TemplateElement") {
        node.elements[i].rawValue = escapeHTML(node.elements[i].rawValue);
      }
    }
    return codegen.FormattedCodeGen.prototype.reduceTemplateExpression.call(this, node, obj);
  };
  webGen.reduceAssignmentTargetIdentifier = function(binding) {
    var rep = codegen.FormattedCodeGen.prototype.reduceAssignmentTargetIdentifier.call(this, binding);
    var ind = identifiers.indexOf(binding);
    if (ind === -1) {
      ind = identifiers.length;
      identifiers.push(binding);
    }
    rep.token = "<span class=\"code-binding\" data-identifier=\"" + ind + "\">" + rep.token + "</span>";
    return rep;
  };
  webGen.reduceBindingIdentifier = function(binding) {
    var rep = codegen.FormattedCodeGen.prototype.reduceBindingIdentifier.call(this, binding);
    var ind = identifiers.indexOf(binding);
    if (ind === -1) {
      ind = identifiers.length;
      identifiers.push(binding);
    }
    rep.token = "<span class=\"code-binding\" data-identifier=\"" + ind + "\">" + rep.token + "</span>";
    return rep;
  };
  webGen.reduceIdentifierExpression = function(identifier) {
    var rep = codegen.FormattedCodeGen.prototype.reduceIdentifierExpression.call(this, identifier);
    var ind = identifiers.indexOf(identifier);
    if (ind === -1) {
      ind = identifiers.length;
      identifiers.push(identifier);
    }
    rep.token = "<span class=\"code-identifier\" data-identifier=\"" + ind + "\">" + rep.token + "</span>";
    return rep;
  };
  return webGen;
}

function onChange() {
  var code = editor.getValue();
  var parseFn = radio.checked ? parser.parseScript : parser.parseModule;
  try {
    var ast = parseFn(code);
    lookup = new scope.ScopeLookup(scope.default(ast));
    identifiers = [];
    var program = codegen.default(ast, new WebGen);
  } catch (ex) {
    displayError(ex);
    return;
  }
  render(program);
}

editor.getSession().on('change', debounce(onChange, 300));
radio.addEventListener('change', onChange);
radio2.addEventListener('change', onChange);

window.addEventListener('DOMContentLoaded', onChange);
