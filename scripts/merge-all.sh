#!/bin/bash
set -e
set -o xtrace

current_branch=`git rev-parse --abbrev-ref HEAD`
git checkout release
git merge --no-edit master
git checkout xwalk
git merge --no-edit release
git checkout "$current_branch"
