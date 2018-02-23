#!/bin/bash

# Get directory path of *this* script file and exit if is not set, NULL, or an empty string
SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
SCRIPTS_DIR="${SCRIPTS_DIR:?}"
ROOT_DIR=$(realpath "${SCRIPTS_DIR}/..")
REPORTS_DIR="${ROOT_DIR}/reports"
GITHUB_REPORT_FILE="${REPORTS_DIR}/lint.githubCommentFile"
GITHUB_REPORT_FILE_TMP="${GITHUB_REPORT_FILE}.tmp"
FORMATTER="${ROOT_DIR}/bin/eslint-markdown-formatter.js"

echo -ne "## Linter\n\n" | tee -a "${GITHUB_REPORT_FILE_TMP}"

if [ ! -z "${JOB_BASE_NAME}" ]; then
  # Act as if on Jenkins if the JOB_BASE_NAME environment variable exists
  FORMAT_ARG="--format ${FORMATTER}"
fi

yarn -s eslint \
  --ignore-path .gitignore \
  ${FORMAT_ARG} \
  "${ROOT_DIR}/**/*.js" 2>&1 | tee -a "${GITHUB_REPORT_FILE_TMP}"

ESLINT_RESULT=${PIPESTATUS[0]}

DETAILS_LINE_NO=$(grep -nE '^## Details' ${GITHUB_REPORT_FILE_TMP} | awk -F':' '{print $1}')

let USEFUL_LINE_COUNT=${DETAILS_LINE_NO}-1

head -n ${USEFUL_LINE_COUNT} ${GITHUB_REPORT_FILE_TMP} > ${GITHUB_REPORT_FILE}

echo -ne "\n\n" | tee -a "${GITHUB_REPORT_FILE}"

exit ${ESLINT_RESULT}
