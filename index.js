const path = require("path");
const { diffCurrentHeadWithReference, getChanges } = require("./lib/git");

const bitbucket = require("./lib/formatting/diff/bitbucket");
const github = require("./lib/formatting/diff/github");

const nyc = require("./lib/nyc");
const mochawesome = require("./lib/mochawesome");

const SUCCESS_EXIT_CODE = 0;

const diff = userOptions => {
  const options = {};

  options.startsWith = userOptions.startsWith || ".changes";
  options.noChangeMessage =
    userOptions.noChangeMessage || "No changelog modifications were found";
  options.noChangeExitCode = userOptions.noChangeExitCode || -1;
  options.gitDir = path.resolve(userOptions.gitDir || ".git");
  options.diffAgainstReference =
    userOptions.diffAgainstReference || "refs/remotes/origin/master";
  options.diffFormatEngine = userOptions.diffFormatEngine || "github";

  const patchesFilter = patch => {
    return patch
      .newFile()
      .path()
      .startsWith(options.startsWith);
  };

  const DIFF_FORMAT_ENGINES = {
    bitbucket: bitbucket.formatPatchesForComment,
    github: github.formatPatchesForComment,
  };

  const formatPatches = DIFF_FORMAT_ENGINES[options.diffFormatEngine];

  const diffOpts = { contextLines: 0 };

  return diffCurrentHeadWithReference(
    options.gitDir,
    options.diffAgainstReference,
    {
      diffOpts,
    }
  )
    .then(diff => getChanges(diff, { patchesFilter }))
    .then(data => {
      if (!data.patches || data.patches.length === 0) {
        console.log(options.noChangeMessage);
        console.log();

        return options.noChangeExitCode;
      }

      console.log(formatPatches(data.patches));
      console.log();

      return SUCCESS_EXIT_CODE;
    });
};

module.exports = {
  // Provides simple APIs to the most high level utilities
  simple: {
    diff,
    nyc,
    mochawesome,
  },
};
