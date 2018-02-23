const path = require("path");

const root = process.env.ROOT_DIR;
const libDir = "lib";
const formattingDir = path.join(libDir, "formatting");
const diffDir = path.join(formattingDir, "diff");

const github = require(path.join(root, diffDir, "github"));

const { expect } = require("chai");

describe("exports", () => {
  it("formatPatchesForComment", () => {
    expect(github.formatPatchesForComment).to.be.an("function");
  });
});
