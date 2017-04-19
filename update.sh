set -x
./node_modules/.bin/cjsify "`node -e \"console.log(require.resolve('shift-codegen'))\"`" -x codegen --no-node --minify > js/shift-codegen.js
./node_modules/.bin/cjsify "`node -e \"console.log(require.resolve('shift-fuzzer'))\"`" -x fuzzer --no-node --minify > js/shift-fuzzer.js
./node_modules/.bin/cjsify "`node -e \"console.log(require.resolve('shift-parser'))\"`" -x parser --no-node --minify > js/shift-parser.js
./node_modules/.bin/cjsify "`node -e \"console.log(require.resolve('shift-reducer'))\"`" -x reducer --no-node --minify > js/shift-reducer.js
./node_modules/.bin/cjsify "`node -e \"console.log(require.resolve('shift-scope'))\"`" -x scope --no-node --minify > js/shift-scope.js
./node_modules/.bin/cjsify "`node -e \"console.log(require.resolve('shift-validator'))\"`" -x validator --no-node --minify > js/shift-validator.js
