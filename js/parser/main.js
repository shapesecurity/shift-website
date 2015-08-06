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

var editor = ace.edit(document.querySelector("#demo1 .editor")),
    session = editor.getSession(),
    Range = ace.require('ace/range').Range;

var error = document.querySelector("#demo1 .error-message");
var output = document.querySelector("#demo1 .output");
var outputContainer = document.querySelector("#demo1 .output-container");

function displayError(exception) {
  hideError();
  error.innerText = exception.message;
  if (exception.line) {
    session.setAnnotations([{
      row: exception.line - 1,
      column: exception.column,
      text: exception.description,
      type: "error" // also warning and information
    }]);
  }
  outputContainer.classList.add("error");
}

function hideError() {
  session.clearAnnotations();
}

function render(ast) {
  hideError();
  outputContainer.classList.remove("error");
  output.display(ast);
}

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

function onChange() {
  var code = editor.getValue();
  try {
    var ast = parser.parseModule(code, { loc: false, earlyErrors : true });
    render(ast);
  } catch (ex) {
    displayError(ex);
  }
}

editor.getSession().on('change', debounce(onChange, 300));

window.addEventListener('polymer-ready', onChange);
