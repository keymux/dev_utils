const path = require("path");

const rootPath = path.join(__dirname, "../../..");
const gitPath = path.join(rootPath, ".git");
const libPath = path.join(rootPath, "lib");

const git = require(path.join(libPath, "git"));
const { print } = require(path.join(libPath, "utils"));

const { expect } = require("chai");
const { Commit, Diff, Oid, Reference, Repository, Tree } = require("nodegit");

describe("lib/git", () => {
  describe("getRepo", () => {
    let repoPromise;

    beforeEach(() => {
      repoPromise = git.getRepo(gitPath);
    });

    it("should resolve with a repository when given a valid git repository", () => {
      return repoPromise.then(data => {
        expect(data.repo instanceof Repository).to.be.true;
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
          .then(data => git.getReference(data.repo, "refs/heads/master"))
          .then(masterReference => {
            expect(masterReference instanceof Reference).to.be.true;
          });
      });
    });

    describe("getReferenceTarget", () => {
      it("should resolve with an Oid object", () => {
        return repoPromise
          .then(data => git.getReferenceTarget(data.repo, "refs/heads/master"))
          .then(masterTarget => {
            expect(masterTarget instanceof Oid).to.be.true;
          });
      });
    });

    describe("getReferenceCommit", () => {
      it("should resolve with a Commit object", () => {
        return repoPromise
          .then(data => git.getReferenceCommit(data.repo, "refs/heads/master"))
          .then(masterCommit => {
            expect(masterCommit instanceof Commit).to.be.true;
          });
      });
    });

    describe("getReferenceTree", () => {
      it("should resolve with a Tree object", () => {
        return repoPromise
          .then(data => git.getReferenceTree(data.repo, "refs/heads/master"))
          .then(print)
          .then(masterTree => {
            expect(masterTree instanceof Tree).to.be.true;
          });
      });
    });
  });
});
