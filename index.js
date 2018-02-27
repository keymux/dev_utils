const path = require("path");
const { spawn } = require("child_process");
const { print } = require("./lib/utils");

const eslint = require("./lib/formatting/linter/eslint");
const nyc = require("./lib/nyc");
const mochawesome = require("./lib/mochawesome");

const diff = userOptions => {
  return new Promise(resolve => {
    const options = {};

    options.startsWith = userOptions.startsWith || ".changes";
    options.noChangeMessage =
      userOptions.noChangeMessage || "No changes were found";
    options.noChangeExitCode = userOptions.noChangeExitCode || -1;

    // gitDir isn't used in this implementation
    options.gitDir = path.resolve(userOptions.gitDir || ".git");
    options.diffAgainstReference =
      userOptions.diffAgainstReference || "refs/remotes/origin/master";

    // Since we only support bitbucket and github anyway, there is only one format
    options.diffFormatEngine = userOptions.diffFormatEngine || "github";

    const diff = spawn("git", [
      "diff",
      "-U0",
      "-w",
      userOptions.diffAgainstReference,
      options.startsWith,
    ]);

    const data = [];
    const dataStdErr = [];

    diff.stdout.on("data", chunk => {
      data.push(chunk.toString());
    });

    diff.stderr.on("data", chunk => {
      dataStdErr.push(chunk.toString());
    });

    diff.on("close", code => {
      if (code !== 0) {
        resolve({
          lines: ["Unexpected error"].concat(dataStdErr.join("").split("\n")),
          exitCode: code,
        });
      } else {
        if (data.length > 0) {
          const lines = ["```diff"]
            .concat(
              data
                .join("")
                .split("\n")
                .filter(line => ["-", "+"].includes(line[0]))
                .slice(1)
            )
            .concat(["```"]);

          resolve({ lines, exitCode: 0 });
        } else {
          resolve({
            lines: [options.noChangeMessage],
            exitCode: options.noChangeExitCode,
          });
        }
      }
    });
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
