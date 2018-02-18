#!/usr/bin/env node

const { print } = require("../lib/utils");

const parseArgs = require("minimist");

const cliArgs = parseArgs(process.argv.slice(2));

const main = () => {
  const options = Object.assign({}, cliArgs);

  if (options.mochawesome_json === undefined) {
    console.log("Must provide --mochawesome_json parameter");

    process.exit(cliArgs.onErrorExitCode || -1);
  }

  return require("../index.js").simple.mochawesome.statsToMarkdown(options);
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
