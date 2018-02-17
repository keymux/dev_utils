#!/bin/bash

bin/directory-changed.js \
  --gitDir=.git \
  --startsWith=.changes \
  --diffAgainstReference="origin/${ghprbTargetBranch}"
