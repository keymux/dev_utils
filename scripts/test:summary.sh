#!/bin/bash

# Get directory path of *this* script file and exit if is not set, NULL, or an empty string
SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
SCRIPTS_DIR="${SCRIPTS_DIR:?}"
ROOT_DIR=$(realpath "${SCRIPTS_DIR}/..")
REPORTS_DIR="${ROOT_DIR}/reports"
UNIT_REPORTS_DIR="${REPORTS_DIR}/unit"
TEST_DIR="${ROOT_DIR}/test/unit"
GITHUB_REPORT_FILE="${REPORTS_DIR}/githubCommentFile"

GITHUB_REPORT_FILES=( \
  "${REPORTS_DIR}/unit.githubCommentFile" \
  "${REPORTS_DIR}/coverage.githubCommentFile" \
  "${REPORTS_DIR}/changelog.githubCommentFile" \
  "${REPORTS_DIR}/lint.githubCommentFile" \
  )

rm -f "${GITHUB_REPORT_FILE}"

for file in ${GITHUB_REPORT_FILES[@]}; do
  cat "${file}" >> "${GITHUB_REPORT_FILE}"
done

# Ignore if any commands fail
exit 0
