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

var editor = {
  target: ace.edit(document.querySelector("#demo1 #target-program.editor")),
  reducer: ace.edit(document.querySelector("#demo1 #reducer-program.editor"))
};

var error = document.querySelector("#demo1 .error-message");
var output = document.querySelector("#demo1 .output");
var outputContainer = document.querySelector("#demo1 .output-container");


function displayError(exception, editor) {
  hideError(editor);
  error.innerText = exception.message;
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

function hideError(editor) {
  editor.getSession().clearAnnotations();
}

function render(program) {
  outputContainer.classList.remove("error");
  output.textContent = program;
  hljs.highlightBlock(output);
}

[editor.target, editor.reducer].forEach(function (editor) {
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
  // session.on('change', debounce(onChange, 300));
});

function onChange() {
  var targetCode = editor.target.getValue();
  var reducerCode = editor.reducer.getValue();

  try {
    var ast = parser.parseModule(targetCode, { loc: true, earlyErrors: true });
  } catch (ex) {
    displayError(ex, editor.target);
    return;
  }
  hideError(editor.target);
  try {
    var inputReducer = new ((0, eval)(reducerCode));
  } catch (ex) {
    displayError(ex, editor.reducer);
    return;
  }
  hideError(editor.reducer);
  var state = reducer.default(inputReducer, ast);
  render(JSON.stringify(state));
}


window.addEventListener('DOMContentLoaded', onChange);
