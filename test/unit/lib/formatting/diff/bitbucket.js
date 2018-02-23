const path = require("path");

const root = process.env.ROOT_DIR;
const libDir = "lib";
const formattingDir = path.join(libDir, "formatting");
const diffDir = path.join(formattingDir, "diff");

const bitbucket = require(path.join(root, diffDir, "bitbucket"));

const { expect } = require("chai");

describe("exports", () => {
  it("formatPatchesForComment", () => {
    expect(bitbucket.formatPatchesForComment).to.be.an("function");
  });
});
