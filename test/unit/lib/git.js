const path = require("path");
const { expect } = require("chai");

const root = process.env.ROOT_DIR;
const testDir = "test";
const libDir = "lib";

const gitPath = path.join(root, ".git");

const util = require(path.join(root, testDir, libDir, "util"));

const git = require(path.join(root, libDir, "git"));

// eslint-disable-next-line no-unused-vars
const { Commit, Diff, Oid, Reference, Repository, Tree } = require("nodegit");

describe("git", () => {
  describe("exports", () => {
    const expectedExports = [
      "diffCurrentHeadWithReference",
      "getChanges",
      "getHeadCommit",
      "getHeadTree",
      "getMasterCommit",
      "getMasterTree",
      "getReference",
      "getReferenceTarget",
      "getReferenceCommit",
      "getReferenceTree",
      "getRepo",
    ];

    util.expectExports(git, expectedExports);
  });

  const masterReference = process.env.MASTER_REFERENCE;

  let repoPromise;

  beforeEach(() => {
    repoPromise = git.getRepo(gitPath);
  });

  describe("getRepo", () => {
    it("should resolve with a repository when given a valid git repository", () => {
      return repoPromise.then(data => {
        expect(data.repo instanceof Repository).to.be.true;
      });
    });
  });

  describe("getHeadCommit", () => {
    it("should resolve with a Commit object", () => {
      return repoPromise
        .then(data => git.getHeadCommit(data.repo))
        .then(headCommit => {
          expect(headCommit instanceof Commit).to.be.true;
        });
    });
  });

  describe("getHeadTree", () => {
    it("should resolve with a Tree object", () => {
      return repoPromise
        .then(data => git.getHeadTree(data.repo))
        .then(headTree => {
          expect(headTree instanceof Tree).to.be.true;
        });
    });
  });

  describe.skip("getMasterCommit", () => {
    it("should resolve with a Commit object", () => {
      return repoPromise
        .then(data => git.getMasterCommit(data.repo))
        .then(masterCommit => {
          expect(masterCommit instanceof Commit).to.be.true;
        });
    });
  });

  describe("getReference", () => {
    it("should resolve with a Reference object", () => {
      return repoPromise
        .then(data => git.getReference(data.repo, masterReference))
        .then(masterReference => {
          expect(masterReference instanceof Reference).to.be.true;
        });
    });
  });

  describe("getReferenceTarget", () => {
    it("should resolve with an Oid object", () => {
      return repoPromise
        .then(data => git.getReferenceTarget(data.repo, masterReference))
        .then(masterTarget => {
          expect(masterTarget instanceof Oid).to.be.true;
        });
    });
  });

  describe("getReferenceCommit", () => {
    it("should resolve with a Commit object", () => {
      return repoPromise
        .then(data => git.getReferenceCommit(data.repo, masterReference))
        .then(masterCommit => {
          expect(masterCommit instanceof Commit).to.be.true;
        });
    });
  });

  describe("getReferenceTree", () => {
    it("should resolve with a Tree object", () => {
      return repoPromise
        .then(data => git.getReferenceTree(data.repo, masterReference))
        .then(masterTree => {
          expect(masterTree instanceof Tree).to.be.true;
        });
    });
  });
});
