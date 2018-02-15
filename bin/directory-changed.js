#!/usr/bin/env node

const {
  diffCurrentHeadWithReference,
  formatPatches,
  getChanges,
} = require("../lib/git");

const { print, unhandledPromiseRejectionHandler } = require("../lib/utils");

process.on("unhandledRejection", unhandledPromiseRejectionHandler);

const parseArgs = require("minimist");

const cliArgs = parseArgs(process.argv.slice(2));

const main = () => {
  cliArgs.startsWith = cliArgs.startsWith || ".changes";
  cliArgs.noChangeMessage =
    cliArgs.noChangeMessage || "No changelog modifications were found";
  cliArgs.onErrorExitCode = cliArgs.onErrorExitCode || -1;
  cliArgs.gitDir = cliArgs.gitDir || "./.git";
  cliArgs.diffAgainstReference =
    cliArgs.diffAgainstReference || "refs/remotes/origin/master";

  const patchesFilter = patch => {
    return patch
      .newFile()
      .path()
      .startsWith(cliArgs.startsWith);
  };

  const diffOpts = { contextLines: 0 };

  return diffCurrentHeadWithReference(
    cliArgs.gitDir,
    cliArgs.diffAgainstReference,
    {
      diffOpts,
    }
  )
    .then(diff => getChanges(diff, { patchesFilter }))
    .then(data => {
      if (!data.patches || data.patches.length === 0) {
        console.log(cliArgs.noChangeMessage);

        throw new Error(cliArgs.noChangeMessage);
      }

      console.log(formatPatches(data.patches, { bitbucketComment: true }));
    });
};

main()
  .then()
  .catch(err => {
    print(err);

    process.exit(cliArgs.onErrorExitCode);
  });
