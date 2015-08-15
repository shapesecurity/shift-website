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

var editor =  ace.edit(document.querySelector("#demo1 .editor"))

var error = document.querySelector("#demo1 .error-message");
var output = document.querySelector("#demo1 .output");
var outputContainer = document.querySelector("#demo1 .output-container");
var goButton = document.querySelector("#demo1 .go-button");

function displayError(exception, editor) {
  hideError(editor);
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

function hideError(editor) {
  outputContainer.classList.remove("error");
  editor.getSession().clearAnnotations();
}

function render(program) {
  output.textContent = program;
  hljs.highlightBlock(output);
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


var lastExecutedProgram;

session.on('change', debounce(function onChange() {
  var input = editor.getValue();
  goButton.style.display = "none";
  compile(input, function(ast, program) {
    goButton.style.display = input === lastExecutedProgram ? "none" : "initial";
  });
}, 300));

function go(){
  var input = editor.getValue();
  compile(input, function(ast, program) {
    lastExecutedProgram = input;
    exec(ast, program);
    goButton.style.display = "none";
  });
}
goButton.addEventListener("click", go);

function compile(es6program, cont) {
  try {
    var ast = parser.parseModule(es6program, { earlyErrors: true });
  } catch (ex) {
    displayError(ex, editor);
    return;
  }
  hideError(editor);

  try {
    var es5program = babel(es6program, { ast: false, retainLines: true }).code;
  } catch (ex) {
    ex.line = ex.loc.line;
    ex.column = ex.loc.column;
    displayError(ex, editor);
    return;
  }
  hideError(editor);

  cont(ast, es5program);
}

function exec(ast, program) {
  var exports = {}, module = {exports: exports};
  try {
    eval(program);
    var inputReducer = new exports.default;
    var state = reducer.default(inputReducer, ast);
  } catch (ex) {
    findEvalLineNumber(ex);
    displayError(ex, editor);
    return;
  }
  hideError(editor);
  render(JSON.stringify(state, null, 2));
}

function findEvalLineNumber(ex) {
  ex.column = ex.column || ex.columnNumber;
  ex.line = ex.line || ex.lineNumber;
  if (!ex.line) {
    var stackLines = ex.stack.split("\n");
    var match = stackLines[1].match(/<anonymous>:(\d+):(\d+)/) || stackLines[0].match(/eval:(\d+):(\d+)/);
    if (match != null) {
      ex.line = match[1];
      ex.column = match[2];
    }
  }
}

window.addEventListener('DOMContentLoaded', go);
