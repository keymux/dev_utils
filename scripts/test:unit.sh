#!/bin/bash

# Get directory path of *this* script file and exit if is not set, NULL, or an empty string
SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
SCRIPTS_DIR="${SCRIPTS_DIR:?}"
ROOT_DIR="${SCRIPTS_DIR}/.."
REPORTS_DIR="${ROOT_DIR}/reports/unit"
TEST_DIR="${ROOT_DIR}/test/unit"

mocha --reporter mochawesome test/unit/**/*.js --reporter-options reportDir="${REPORTS_DIR}"
