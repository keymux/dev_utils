#!/bin/bash

# Get directory path of *this* script file and exit if is not set, NULL, or an empty string
SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
SCRIPTS_DIR="${SCRIPTS_DIR:?}"
ROOT_DIR=$(realpath "${SCRIPTS_DIR}/..")
REPORTS_DIR="${ROOT_DIR}/reports/unit"
TEST_DIR="${ROOT_DIR}/test/unit"

export ROOT_DIR
MASTER_REFERENCE="refs/remotes/origin/master" \
  mocha --reporter mochawesome test/unit/index.js --reporter-options reportDir="${REPORTS_DIR}"
MOCHA_RESULT=$?

"${ROOT_DIR}/bin/mochawesome-markdown.js" \
  --mochawesome_json="${REPORTS_DIR}/mochawesome.json" \
  --header='## Unit tests' \
  --footer="[Jenkins Build](${RUN_DISPLAY_URL})"

exit ${MOCHA_RESULT}
