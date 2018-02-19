#!/usr/bin/env node

const { print } = require("../lib/utils");

const parseArgs = require("minimist");

const cliArgs = parseArgs(process.argv.slice(2));

const main = () => {
  const options = Object.assign({}, cliArgs);

  return require("../index.js").simple.nyc.nycToMarkdown(options);
};

if (!module.parent) {
  main()
    // Exit with the code provided
    .then(process.exit)
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