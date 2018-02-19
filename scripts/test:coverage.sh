#!/bin/bash

# Get directory path of *this* script file and exit if is not set, NULL, or an empty string
SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
SCRIPTS_DIR="${SCRIPTS_DIR:?}"
ROOT_DIR=$(realpath "${SCRIPTS_DIR}/..")
REPORTS_DIR="${ROOT_DIR}/reports"
UNIT_REPORTS_DIR="${REPORTS_DIR}/unit"
GITHUB_REPORT_FILE="${REPORTS_DIR}/coverage.githubCommentFile"

export MASTER_REFERENCE="refs/remotes/origin/master"
export ROOT_DIR

echo -ne "## Unit Test Coverage\n\n" | tee -a "${GITHUB_REPORT_FILE}"

yarn nyc \
  --reporter=lcov \
  --reporter=json-summary \
  --report-dir=${UNIT_REPORTS_DIR}/coverage \
  mocha test/unit/index.js

NYC_RESULT=$?

bin/nyc-markdown.js \
  --coverage_filename reports/unit/coverage/coverage-summary.json \
  | tee -a "${GITHUB_REPORT_FILE}"

echo -ne "\n\n" | tee -a "${GITHUB_REPORT_FILE}"

exit ${NYC_RESULT}
