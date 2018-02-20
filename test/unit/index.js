const path = require("path");
const { expect } = require("chai");

const root = process.env.ROOT_DIR;
const testDir = "test";
const unitDir = path.join(testDir, "unit");
const libDir = "lib";

const util = require(path.join(root, testDir, libDir, "util"));
const util_fs = require(path.join(root, libDir, "util_fs"));

const { print } = require(path.join(root, libDir, "utils"));

require(path.join(root, libDir, "git"));
//require(path.join(root, unitDir, libDir, "git"));

describe(path.basename(process.env.ROOT_DIR), () => {
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
  /*
    .then(print)
    .then(processItem)
    .then(print)
    .catch(err => {
      print(err);

      process.exit(-1);
    });
  */
});
