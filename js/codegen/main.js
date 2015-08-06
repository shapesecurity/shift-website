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

var editor = ace.edit("editor"),
    session = editor.getSession(),
    Range = ace.require('ace/range').Range;

var error = document.getElementById("error-message");
var output = document.getElementById("output");
var outputContainer = document.getElementById("output-container");


function displayError(exception) {
  hideError();
  error.innerText = exception.message;
  outputContainer.classList.add("error");
}

function hideError() {
  session.clearAnnotations();
}


function render(program) {
  hideError();
  outputContainer.classList.remove("error");
  output.textContent = program;
  hljs.highlightBlock(output);
}

editor.setBehavioursEnabled(false);
editor.setHighlightActiveLine(false);
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
    var program = codegen.default((0, eval)("(" + code + ")"));
    render(program);
  } catch (ex) {
    displayError(ex);
  }
}

editor.getSession().on('change', debounce(onChange, 300));

window.addEventListener('DOMContentLoaded', function () {
  onChange();
})

