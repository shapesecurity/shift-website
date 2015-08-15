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
session.setMode("ace/mode/json");
session.setOption("useWorker", false);
session.setTabSize(2);
session.setUseSoftTabs(true);
session.setUseWrapMode(false);

function onChange() {
  var code = editor.getValue();
  try {
    var ast = (0, eval)("(function(){return " + code + "}())");
    var program = codegen.default(ast);
  } catch (ex) {
    displayError(ex);
    return;
  }
  render(program);
}

editor.getSession().on('change', debounce(onChange, 300));

window.addEventListener('DOMContentLoaded', onChange);
