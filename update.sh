set -x
for module in parser codegen scope fuzzer reducer validator template ast; do
  echo 'window.'${module}' = require("shift-'${module}'");' | $(npm bin)/esbuild --bundle | ./node_modules/.bin/terser --compress --mangle -o js/shift-${module}.js
done