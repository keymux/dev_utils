#!/bin/bash

# Get directory path of *this* script file and exit if is not set, NULL, or an empty string
SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
SCRIPTS_DIR="${SCRIPTS_DIR:?}"
ROOT_DIR=$(realpath "${SCRIPTS_DIR}/..")
REPORTS_DIR="${ROOT_DIR}/reports"
GITHUB_REPORT_FILE="${REPORTS_DIR}/changelog.githubCommentFile"

if [ -z "${ghprbTargetBranch}" ]; then
  if [ -z "$1" ]; then
    echo "No branch to compare against." >&2

    exit -1
  else
    ghprbTargetBranch=$1
  fi
fi

echo -ne "## Changelog\n\n" | tee -a "${GITHUB_REPORT_FILE}"

bin/directory-changed.js \
  --gitDir=.git \
  --startsWith=.changes \
  --diffAgainstReference="origin/${ghprbTargetBranch}" \
  | tee -a "${GITHUB_REPORT_FILE}"

DIR_CHNG_RESULT=$?

echo -ne "\n\n" | tee -a "${GITHUB_REPORT_FILE}"

exit ${DIR_CHNG_RESULT}
