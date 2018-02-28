const path = require("path");

const root = process.env.ROOT_DIR;
const testDir = "test";
const unitDir = path.join(testDir, "unit");
const libDir = "lib";

const util = require(path.join(root, testDir, libDir, "util"));
const util_fs = require(path.join(root, libDir, "util_fs"));

const index = require(path.join(root, "index"));

describe(path.basename(process.env.ROOT_DIR), () => {
  describe("index", () => {
    describe("exports", () => {
      const expectedExports = ["simple", "lib", "test"];

      util.expectExports(index, expectedExports);
    });

    describe("simple", () => {
      const expectedExports = ["diff", "eslint", "nyc", "mochawesome"];
      util.expectExports(index.simple, expectedExports);
    });

    describe("lib", () => {
      const expectedExports = ["util_fs"];
      util.expectExports(index.lib, expectedExports);
    });

    describe("test", () => {
      const expectedExports = ["util"];
      util.expectExports(index.test, expectedExports);
    });
  });

  const processItem = item => {
    if (item.directoryContents) {
      const recurse = () => {
        item.directoryContents
          .filter(item => item.file !== __filename)
          .forEach(each => {
            processItem(each);
          });
      };

      const bn = path.basename(item.directory);

      if (bn !== "unit" && bn !== "test") {
        describe(path.basename(item.directory), () => {
          recurse();
        });
      } else {
        recurse();
      }
    } else {
      const bn = path.basename(item.file);

      describe(bn, () => {
        require(item.file);
      });
    }
  };

  [
    {
      directory: path.join(root, unitDir),
      directoryContents: [util_fs.findFilesSync(path.join(root, unitDir))],
    },
  ].forEach(processItem);
});
