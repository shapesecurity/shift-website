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

function displayError(exception) {
  hideError();
  error.textContent = exception.description;
  console.dir(exception);
  if (exception.line) {
    editor.getSession().setAnnotations([{
      row: exception.line - 1,
      column: exception.column,
      text: exception.description,
      type: "error" // also warning and information
    }]);
  }
  outputContainer.classList.add("error");
}

function hideError() {
  outputContainer.classList.remove("error");
  editor.getSession().clearAnnotations();
}

function render(ast) {
  hideError();
  output.display(ast);
}

var session = editor.getSession();
editor.setBehavioursEnabled(false);
editor.setHighlightActiveLine(false);
editor.setOption("fontFamily", "Source Code Pro");
editor.setOption("fontSize", "10pt");
editor.setShowPrintMargin(false);
editor.setTheme("ace/theme/textmate");
editor.setWrapBehavioursEnabled(false);
editor.setReadOnly(true)
session.setMode("ace/mode/javascript");
session.setOption("useWorker", false);
session.setTabSize(2);
session.setUseSoftTabs(true);
session.setUseWrapMode(false);


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
  return webGen;
}

var statusSpan = document.querySelector(".status");

function setStatus(passed, type, code) {
  var link = document.createElement('a');
  if (passed) {
    link.innerHTML = 'Parse!';
    link.href = 'parser.html?type=' + type + '&code=' + encodeURIComponent(code);
    statusSpan.innerHTML = '&#10003; - ';
  } else {
    link.innerHTML = 'Open an issue!';
    link.href = 'https://github.com/shapesecurity/shift-fuzzer-js/issues/new?title=I%20found%20a%20bug%20using%20the%20demo!&body=Here\'s%20the%20code%3A%0A%0A%60%60%60js%0A' + encodeURIComponent(code) + "%60%60%60";
    statusSpan.innerHTML = '&#10006; FAILED - ';
  }
  statusSpan.appendChild(link);
}

function knownErrors(tree) {
  var errList = validator.Validator.validate(tree);
  return errList.length > 0 && errList.every(function (e) {
    return e.description && e.description.match('is not declared') || e.message && e.message.match(/Duplicate (binding|export)|is not declared/); // pending https://github.com/shapesecurity/shift-fuzzer-js/issues/2
  });
}

function generate() {
  var tree;
  do {
    tree = fuzzer.fuzzProgram();
  } while (knownErrors(tree));
  session.setValue(codegen.default(tree, new WebGen));
  var code = codegen.default(tree, new codegen.FormattedCodeGen);
  try {
    parser[tree.type === 'Script' ? 'parseScript' : 'parseModule'](code);
    setStatus(true, tree.type, code);
  } catch(e) {
    setStatus(false, tree.type, code);
  }
}

document.querySelector("#generate-btn").addEventListener("click", generate);

generate();
