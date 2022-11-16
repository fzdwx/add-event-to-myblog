#!/usr/bin/env just --justfile
export PATH := "./node_modules/.bin:" + env_var('PATH')
#export NODE_OPTIONS := "--openssl-legacy-provider"

build2:
  yarn  build && yarn package
  git add dist
  git commit -a -m "prod dependencies"
  git push 
  
build:
  npm run build && npm run package
  git add dist
  git commit -a -m "prod dependencies"
  git push

b3:
  pnpm  build && pnpm package
  git add dist
  git commit -a -m "prod dependencies"
  git push