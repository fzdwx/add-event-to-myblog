#!/usr/bin/env just --justfile
export PATH := "./node_modules/.bin:" + env_var('PATH')

build:
  npm run build && npm run package
  git add dist
  git commit -a -m "prod dependencies"
  git push 