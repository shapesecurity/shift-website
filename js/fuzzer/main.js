"use strict";

var editor = ace.edit(document.querySelector("#demo1 .editor"));
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


var generateButton = document.querySelector("#demo1 .actions .generate-button"),
  sendToParserButton = document.querySelector("#demo1 .actions .send-to-parser");

sendToParserButton.addEventListener("click", function(){ sendToParserButton.children[0].click(); });

function setStatus(passed, type, code) {
  var link = document.createElement('a');
  if (passed) {
    link.innerHTML = '?';
    link.href = 'parser.html?type=' + type + '&code=' + encodeURIComponent(code);
    sendToParserButton.innerHTML = '';
    sendToParserButton.appendChild(link);
  } else {
    session.setMode("ace/mode/text");
    sendToParserButton.style.display = 'none';
    link.innerHTML = 'You\'ve found a bug! Open an issue.';
    link.href = 'https://github.com/shapesecurity/shift-fuzzer-js/issues/new?title=' + encodeURIComponent('I found a bug using the demo!') + '&body=' + encodeURIComponent('Here\'s the code:\n\n```js\n' + code.trim() + '\n```');
    generateButton.innerHTML = '';
    generateButton.appendChild(link);
    generateButton.removeEventListener("click", generate);
    generateButton.addEventListener("click", function(){ link.click(); });
    generateButton.classList.remove('btn-primary');
    generateButton.classList.add('btn-danger');
  }
}

function knownErrors(tree) {
  var errList = validator.Validator.validate(tree);
  return errList.length > 0 && errList.every(function (e) {
    return e.description && e.description.match('is not declared') || e.message && e.message.match(/Duplicate (binding|export)|is not declared/); // pending https://github.com/shapesecurity/shift-fuzzer-js/issues/2
  });
}

function generate() {
  var tree, code;
  do {
    tree = fuzzer.fuzzProgram();
    code = codegen.default(tree, new codegen.FormattedCodeGen);
  } while (knownErrors(tree) || code.trim().length === 0);
  session.setValue(codegen.default(tree, new codegen.FormattedCodeGen));
  try {
    parser[tree.type === 'Script' ? 'parseScript' : 'parseModule'](code);
    setStatus(true, tree.type, code);
  } catch(e) {
    setStatus(false, tree.type, code);
  }
}

generateButton.addEventListener("click", generate);

generate();
