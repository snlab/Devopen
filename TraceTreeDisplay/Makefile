.PHONY: update install test clean server

SHELL=/bin/bash

update:
	bower install

local: update
	mkdir -p dist
	cp -r server/* dist/
	pushd dist && npm install && popd
	mkdir -p dist/maple
	cp -rf src/* dist/maple

