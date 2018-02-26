#!/bin/bash

# Get directory path of *this* script file and exit if is not set, NULL, or an empty string
SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
SCRIPTS_DIR="${SCRIPTS_DIR:?}"
ROOT_DIR=$(realpath "${SCRIPTS_DIR}/..")
REPORTS_DIR="${ROOT_DIR}/reports"
EXIT_CODES_DIR="${REPORTS_DIR}/exitCodes"

EXIT_CODE_FILE="${EXIT_CODES_DIR}/${1}"

if [ -f ${EXIT_CODE_FILE}* ]; then
  EXIT_CODE=$(cat ${EXIT_CODE_FILE}*)
else
  echo -ne "$1 did not produce an exit code file ${EXIT_CODE_FILE}\n" >&2

  exit -1
fi

if [ ${EXIT_CODE} -ne 0 ]; then
  echo -ne "$1 exited unsuccessfully with error code ${EXIT_CODE}\n" >&2
fi

exit $(cat ${EXIT_CODE_FILE})
