const path = require("path");
const { expect } = require("chai");

const root = process.env.ROOT_DIR;
const testDir = "test";
const unitDir = path.join(testDir, "unit");
const libPath = "lib";

const util = require(path.join(root, testDir, libPath, "util"));

describe("arrays", () => {
  const arrays = require(path.join(root, libPath, "arrays"));

  describe("exports", () => {
    const expectedExports = ["containsDuplicates", "uniqueConcat"];

    util.expectExports(arrays, expectedExports);
  });

  describe("uniqueConcat", () => {
    const listOfSampleArrays = [
      ["bla1"],
      ["bla2", "bla3"],
      ["bla4", "bla5", "bla6"],
      ["bla1", "bla5", "bla7"],
    ];
    it("should work with two null arrays", () => {
      expect(arrays.uniqueConcat([], [])).to.deep.equal([]);
    });

    it("should work with one null array as the left argument", () => {
      listOfSampleArrays.forEach(ray => {
        expect(arrays.uniqueConcat(ray, [])).to.deep.equal(ray);
      });
    });

    it("should work with one null array as the right argument", () => {
      listOfSampleArrays.forEach(ray => {
        expect(arrays.uniqueConcat([], ray)).to.deep.equal(ray);
      });
    });

    it("should only concatenate unique values", () => {
      listOfSampleArrays.forEach(x => {
        listOfSampleArrays.forEach(y => {
          // The result should only contain the unique values from the combination of the two arrays
          const merged = arrays.uniqueConcat(x, y);

          expect(merged).to.include.members(x);
          expect(merged).to.include.members(y);

          expect(arrays.containsDuplicates(merged), merged).to.be.false;
        });
      });
    });
  });
});
