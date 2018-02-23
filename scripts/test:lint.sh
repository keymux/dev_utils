#!/bin/bash

# Get directory path of *this* script file and exit if is not set, NULL, or an empty string
SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
SCRIPTS_DIR="${SCRIPTS_DIR:?}"
ROOT_DIR=$(realpath "${SCRIPTS_DIR}/..")
REPORTS_DIR="${ROOT_DIR}/reports"
GITHUB_REPORT_FILE="${REPORTS_DIR}/lint.githubCommentFile"
FORMATTER="${ROOT_DIR}/bin/eslint-markdown-formatter.js"

echo -ne "## Linter\n\n" | tee -a "${GITHUB_REPORT_FILE}"

if [ ! -z "${JOB_BASE_NAME}" ]; then
  # Act as if on Jenkins if the JOB_BASE_NAME environment variable exists
  FORMAT_ARG="--format ${FORMATTER}"
fi

yarn -s eslint \
  --ignore-path .gitignore \
  ${FORMAT_ARG} \
  "${ROOT_DIR}/**/*.js" 2>&1 | tee -a "${GITHUB_REPORT_FILE}"

ESLINT_RESULT=${PIPESTATUS[0]}

echo -ne "\n\n" | tee -a "${GITHUB_REPORT_FILE}"

exit ${ESLINT_RESULT}
