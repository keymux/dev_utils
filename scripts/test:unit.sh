#!/bin/bash

# Get directory path of *this* script file and exit if is not set, NULL, or an empty string
SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
SCRIPTS_DIR="${SCRIPTS_DIR:?}"
ROOT_DIR=$(realpath "${SCRIPTS_DIR}/..")
REPORTS_DIR="${ROOT_DIR}/reports"
UNIT_REPORTS_DIR="${REPORTS_DIR}/unit"
TEST_DIR="${ROOT_DIR}/test/unit"
GITHUB_REPORT_FILE="${REPORTS_DIR}/unit.githubCommentFile"

export MASTER_REFERENCE="refs/remotes/origin/master"
export ROOT_DIR

echo -ne "## Unit Test Metrics\n\n" | tee -a "${GITHUB_REPORT_FILE}"

yarn mocha \
  --reporter mochawesome \
  --reporter-options reportDir="${UNIT_REPORTS_DIR}" \
  test/unit/index.js
MOCHA_RESULT=$?

"${ROOT_DIR}/bin/mochawesome-markdown.js" \
  --mochawesome_json="${UNIT_REPORTS_DIR}/mochawesome.json" \
  --footer="[Jenkins Build](${RUN_DISPLAY_URL})" \
  | tee -a "${GITHUB_REPORT_FILE}"

echo -ne "\n\n" | tee -a "${GITHUB_REPORT_FILE}"

exit ${MOCHA_RESULT}
