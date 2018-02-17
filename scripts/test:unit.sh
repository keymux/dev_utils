#!/bin/bash

# Get directory path of *this* script file and exit if is not set, NULL, or an empty string
SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
SCRIPTS_DIR="${SCRIPTS_DIR:?}"
ROOT_DIR=$(realpath "${SCRIPTS_DIR}/..")
REPORTS_DIR="${ROOT_DIR}/reports/unit"
TEST_DIR="${ROOT_DIR}/test/unit"

echo ${ROOT_DIR}
export ROOT_DIR
MASTER_REFERENCE="refs/remotes/origin/master" \
  mocha --reporter mochawesome test/unit/index.js --reporter-options reportDir="${REPORTS_DIR}"
