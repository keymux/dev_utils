const path = require("path");
const fs = require("fs");

const root = process.env.ROOT_DIR;
const testDir = "test";
const libDir = "lib";

const util = require(path.join(root, testDir, libDir, "util"));

const { expect } = require("chai");

describe("util_fs", () => {
  const util_fs = require(path.join(root, libDir, "util_fs"));

  describe("exports", () => {
    const expectedExports = [
      "directories",
      "files",
      "findFiles",
      "findFilesFlatten",
      "findFilesFlattenSync",
      "findFilesSync",
      "ls",
      "lsSync",
      "lsStats",
      "lsStatsSync",
    ];

    util.expectExports(util_fs, expectedExports);
  });

  describe("directories", () => {
    it("should return all the directories at the specified path", () => {
      return util_fs
        .lsStats(root)
        .then(util_fs.directories)
        .then(directories => {
          expect(directories).to.be.an("array");
          expect(directories.length).to.be.above(5);
          directories.forEach(dir => {
            expect(dir.stats.isDirectory()).to.be.true;
          });
        });
    });
  });

  describe("files", () => {
    it("should return all the files at the specified path", () => {
      return util_fs
        .lsStats(root)
        .then(util_fs.files)
        .then(files => {
          expect(files).to.be.an("array");
          expect(files.length).to.be.above(5);
          files.forEach(file => {
            expect(file.stats.isFile()).to.be.true;
          });
        });
    });
  });

  describe("ls", () => {
    it("should return all the items in a directory", () => {
      return util_fs.ls(root).then(items => {
        expect(items).to.be.an("array");
        items.forEach(item => {
          expect(item).to.be.an("string");
        });
      });
    });
  });

  describe("lsStats", () => {
    it("should return an array of objects containing a file and stats attribute", () => {
      return util_fs.lsStats(root).then(resolution => {
        expect(resolution).to.be.an("array");
        expect(resolution.length).to.be.above(5);
        resolution.forEach(item => {
          expect(item.file).to.be.not.undefined;
          expect(item.stats).to.be.not.undefined;
          expect(item.stats instanceof fs.Stats).to.be.true;
        });
      });
    });
  });
});
