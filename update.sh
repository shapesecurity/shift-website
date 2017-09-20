set -x
for module in parser codegen scope fuzzer reducer validator; do
  echo 'window.'${module}' = require("shift-'${module}'");' | ./node_modules/.bin/browserify - -o js/shift-${module}.js
done
