const path = require("path");

const root = process.env.ROOT_DIR;
const testDir = "test";
const libDir = "lib";

const util = require(path.join(root, testDir, libDir, "util"));

const mochawesome = require(path.join(root, libDir, "mochawesome"));

describe("mochawesome", () => {
  describe("exports", () => {
    const expectedExports = ["statsToMarkdown"];

    util.expectExports(mochawesome, expectedExports);
  });
});
