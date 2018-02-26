const path = require("path");
const { diffCurrentHeadWithReference, getChanges } = require("./lib/git");

const bitbucket = require("./lib/formatting/diff/bitbucket");
const github = require("./lib/formatting/diff/github");

const eslint = require("./lib/formatting/linter/eslint");
const nyc = require("./lib/nyc");
const mochawesome = require("./lib/mochawesome");

const diff = userOptions => {
  const lines = [];
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
        lines.push(options.noChangeMessage);
        lines.push("");

        return options.noChangeExitCode;
      }

      lines.push(formatPatches(data.patches));
      lines.push("");

      return lines;
    });
};

module.exports = {
  // Provides simple APIs to the most high level utilities
  simple: {
    diff,
    eslint,
    nyc,
    mochawesome,
  },
};
