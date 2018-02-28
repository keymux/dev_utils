const { expect } = require("chai");

const arrays = require("../../lib/arrays");

const expectExports = (module, expectedExports) => {
  arrays.uniqueConcat(expectedExports, Object.keys(module)).forEach(item => {
    it(item, () => {
      expect(module[item]).to.be.not.undefined;
      expect(expectedExports).to.include(item);
    });
  });
};

module.exports = { expectExports };
