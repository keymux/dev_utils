const path = require("path");

const rootPath = path.join(__dirname, "../../..");
const gitPath = path.join(rootPath, ".git");
const libPath = path.join(rootPath, "lib");

const utils = require(path.join(libPath, "utils"));

const { expect } = require("chai");
const { Commit, Diff, Oid, Reference, Repository, Tree } = require("nodegit");

describe("lib/utils", () => {
  const checkLine = line => {
    expect(line.func).to.be.a("string");
    expect(line.filename).to.be.a("string");
    expect(line.file).to.be.a("string");
    expect(line.dirname).to.be.a("string");
    expect(parseInt(line.line)).to.be.a("number");
    expect(parseInt(line.char)).to.be.a("number");
  };
  describe("getStackLine", () => {
    it("should return this scope", () => {
      const line = utils.getStackLine();

      expect(line.func).to.equal("Context.it");
      expect(line.filename).to.equal(path.basename(__filename));
      expect(line.file).to.equal(__filename);
      expect(line.dirname).to.equal(path.dirname(__filename));

      checkLine(utils.getStackLine());
    });
  });

  describe("getStackLineObjList", () => {
    it("should return a list of objects containing stack trace information", () => {
      utils.getStackLineObjList().forEach(checkLine);
    });
  });
});
