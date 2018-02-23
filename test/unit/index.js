const path = require("path");

const root = process.env.ROOT_DIR;
const testDir = "test";
const unitDir = path.join(testDir, "unit");
const libDir = "lib";

const util_fs = require(path.join(root, libDir, "util_fs"));

require(path.join(root, libDir, "git"));

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
});
