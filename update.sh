set -x
cjsify ../shift-codegen-js/dist/index.js -x codegen --no-node --minify > js/shift-codegen.js
cjsify ../shift-fuzzer-js/dist/index.js -x fuzzer --no-node --minify > js/shift-fuzzer.js
cjsify ../shift-parser-js/dist/index.js -x parser --no-node --minify > js/shift-parser.js
cjsify ../shift-reducer-js/dist/index.js -x reducer --no-node --minify > js/shift-reducer.js
cjsify ../shift-scope-js/dist/index.js -x scope --no-node --minify > js/shift-scope.js
cjsify ../shift-validator-js/dist/index.js -x validator --no-node --minify > js/shift-validator.js
