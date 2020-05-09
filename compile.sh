#!/bin/bash

### Check existing commands

command -v tsc >/dev/null 2>&1 || { echo >&2 "The typescript compiler is not installed"; exit 1; }
command -v uglifyjs >/dev/null 2>&1 || { echo >&2 "UglifyJs is not installed"; exit 1; }


### Compile typescript files using tsc

tsc ./classes/*.ts --out ./sky-map-algorithm.js


## Minify the script with uglifyjs, we get a candybox3.min.js.temp script

uglifyjs sky-map-algorithm.js -c -m -o sky-map-algorithm.min.js


