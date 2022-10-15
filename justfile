#!/usr/bin/env just --justfile
export PATH := "./node_modules/.bin:" + env_var('PATH')

build:
  yarn  build && yarn package
  git add dist
  git commit -a -m "prod dependencies"
  git push 