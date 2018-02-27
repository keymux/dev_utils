#!/usr/bin/env node

const { print } = require("../lib/utils");

const parseArgs = require("minimist");

const cliArgs = parseArgs(process.argv.slice(2));

const main = () => {
  const options = Object.assign({}, cliArgs);

  return require("../index").simple.diff(options);
};

if (!module.parent) {
  main()
    .then(resolution => {
      resolution.lines.forEach(line => console.log(line)); // eslint-disable-line no-console

      return resolution.exitCode;
    })
    .then(exitCode => process.exit(exitCode))
    .catch(err => {
      print("Unhandled error:");
      print(err);

      process.exit(cliArgs.onErrorExitCode || -1);
    });
} else {
  module.exports = {
    main,
  };
}
