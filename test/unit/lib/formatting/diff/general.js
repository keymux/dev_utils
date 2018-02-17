const path = require("path");

const root = process.env.ROOT_DIR;
const testDir = "test";
const unitDir = path.join(testDir, "unit");
const libDir = "lib";
const formattingDir = path.join(libDir, "formatting");
const diffDir = path.join(formattingDir, "diff");

const general = require(path.join(root, diffDir, "general"));

const { expect } = require("chai");

describe("exports", () => {
  it("formatPatchesForComment", () => {
    expect(general.formatPatchesForComment).to.be.an("function");
  });
});
