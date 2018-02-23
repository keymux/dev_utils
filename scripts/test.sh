#!/bin/bash

# Get directory path of *this* script file and exit if is not set, NULL, or an empty string
SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
SCRIPTS_DIR="${SCRIPTS_DIR:?}"
ROOT_DIR=$(realpath "${SCRIPTS_DIR}/..")

yarn clean

STEPS=( \
  "test:changelog" \
  "test:coverage" \
  "test:integration" \
  "test:lint" \
  "test:unit" \
  )

for i in ${STEPS[@]}; do
  yarn ${i}
done

yarn test:summary

for i in ${STEPS[@]}; do
  yarn -s resolve ${i}
done
