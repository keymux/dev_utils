const path = require("path");
const { expect } = require("chai");

const root = process.env.ROOT_DIR;
const libPath = "lib";

const arrays = require(path.join(root, libPath, "arrays"));

const expectExports = (module, expectedExports) => {
  arrays.uniqueConcat(expectedExports, Object.keys(module)).forEach(item => {
    it(item, () => {
      expect(module[item]).to.be.not.undefined;
      expect(expectedExports).to.include(item);
    });
  });
};

module.exports = { expectExports };
