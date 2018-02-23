#!/bin/bash

# Get directory path of *this* script file and exit if is not set, NULL, or an empty string
SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
SCRIPTS_DIR="${SCRIPTS_DIR:?}"
ROOT_DIR=$(realpath "${SCRIPTS_DIR}/..")
REPORTS_DIR="${ROOT_DIR}/reports"
EXIT_CODES_DIR="${REPORTS_DIR}/exitCodes"

mkdir -p ${EXIT_CODES_DIR}

scripts/${1}.sh

echo $? >> ${EXIT_CODES_DIR}/${1}
