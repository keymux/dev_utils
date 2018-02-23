const path = require("path");

const root = process.env.ROOT_DIR;
const testDir = "test";
const libDir = "lib";

const util = require(path.join(root, testDir, libDir, "util"));

const nyc = require(path.join(root, libDir, "nyc"));

describe("nyc", () => {
  describe("exports", () => {
    const expectedExports = ["mapTotalToTable", "nycToMarkdown"];

    util.expectExports(nyc, expectedExports);
  });
});
