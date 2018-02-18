#!/bin/bash

# Get directory path of *this* script file and exit if is not set, NULL, or an empty string
SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
SCRIPTS_DIR="${SCRIPTS_DIR:?}"
ROOT_DIR=$(realpath "${SCRIPTS_DIR}/..")
REPORTS_DIR="${ROOT_DIR}/reports"
CHANGELOG_OUTPUT_FILE="${REPORTS_DIR}/githubCommentFile"

if [ -z "${ghprbTargetBranch}" ]; then
  if [ -z "$1" ]; then
    echo "No branch to compare against." >&2

    exit -1
  else
    ghprbTargetBranch=$1
  fi
fi

echo "## Changelog" | tee -a "${CHANGELOG_OUTPUT_FILE}"

bin/directory-changed.js \
  --gitDir=.git \
  --startsWith=.changes \
  --diffAgainstReference="origin/${ghprbTargetBranch}" \
  | tee -a "${CHANGELOG_OUTPUT_FILE}"
