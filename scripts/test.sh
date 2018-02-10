#!/bin/bash

yarn test:unit && \
  yarn test:integration && \
  yarn test:changelog

exit $?
