const fs = require("fs");
const path = require("path");

const lsSync = fs.readdirSync;

const ls = (dir, options) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, options, (err, files) => {
      if (err) reject(err);

      resolve(files);
    });
  });
};

const lsStatsSync = (dir, options) => {
  return lsSync(dir, options).map(file => {
    const fullFilePath = path.join(dir, file);

    return {
      file: fullFilePath,
      stats: fs.statSync(fullFilePath),
    };
  });
};

const lsStats = (dir, options) => {
  return ls(dir, options).then(files =>
    Promise.all(
      files.map(file => {
        return new Promise((resolve, reject) => {
          const fullFilePath = path.join(dir, file);
          fs.stat(fullFilePath, (err, stats) => {
            if (err) reject(err);
            resolve({
              file: fullFilePath,
              stats,
            });
          });
        });
      })
    )
  );
};

const files = lsStatsResolution => {
  return lsStatsResolution.filter(lsStatsObj => lsStatsObj.stats.isFile());
};

const directories = lsStatsResolution => {
  return lsStatsResolution.filter(lsStatsObj => lsStatsObj.stats.isDirectory());
};

const DEFAULT_FIND_OPTIONS = {
  recurseDepth: 0,
  maxRecurseDepth: 10,
  errorOnTooMuchRecursion: false,
};

const findFilesSync = (directory, options = DEFAULT_FIND_OPTIONS) => {
  if (options.recurseDepth > options.maxRecurseDepth) {
    if (options.errorOnTooMuchRecursion) {
      throw new Error("Too much recursion");
    } else {
      return [];
    }
  }

  const stats = lsStatsSync(directory);
  const files = stats.filter(item => item.stats.isFile());
  const directories = stats.filter(item => item.stats.isDirectory());

  const directoryContents = directories.map(directory =>
    findFilesSync(directory.file, Object.assign({}, options))
  );

  return {
    directory,
    directoryContents: files.concat(directoryContents),
  };
};

const findFiles = (directory, options = DEFAULT_FIND_OPTIONS) => {
  if (options.recurseDepth > options.maxRecurseDepth) {
    return new Promise((resolve, reject) => {
      if (options.errorOnTooMuchRecursion) {
        reject(new Error("Too much recursion"));
      } else {
        resolve([]);
      }
    });
  }

  return lsStats(directory)
    .then(result => {
      const files = result.filter(item => item.stats.isFile());
      const directories = result.filter(item => item.stats.isDirectory());

      const newOptions = Object.assign({}, options);
      ++newOptions.recurseDepth;

      return Promise.all(
        files.concat(
          directories.map(directory => findFiles(directory.file, newOptions))
        )
      );
    })
    .then(directoryContents => ({
      directory,
      directoryContents,
    }));
};

const findFilesFlattenSync = (directory, options = DEFAULT_FIND_OPTIONS) => {
  if (options.recurseDepth > options.maxRecurseDepth) {
    if (options.errorOnTooMuchRecursion) {
      throw new Error("Too much recursion");
    } else {
      return [];
    }
  }

  const stats = lsStatsSync(directory);
  const files = stats.filter(item => item.stats.isFile());
  const directories = stats.filter(item => item.stats.isDirectory());

  const directoryContents = directories.map(directory =>
    findFilesSync(directory.file, Object.assign({}, options))
  );

  return files.concat(directoryContents.filter(item => !item.isDirectory()));
};

const findFilesFlatten = (dir, options = DEFAULT_FIND_OPTIONS) => {
  if (options.recurseDepth > options.maxRecurseDepth) {
    return new Promise((resolve, reject) => {
      if (options.errorOnTooMuchRecursion) {
        reject(new Error("Too much recursion"));
      } else {
        resolve([]);
      }
    });
  }

  return lsStats(dir, options)
    .then(Promise.all(files, directories))
    .then(result => {
      const files = result[0];
      const directories = result[1];
      return Promise.all(
        directories.map(directory => findFilesFlatten(directory))
      )
        .then(arrayOfArraysOfFiles => arrayOfArraysOfFiles.flatten())
        .then(moreFiles => {
          return [[files], moreFiles].flatten();
        });
    });
};

module.exports = {
  directories,
  files,
  findFiles,
  findFilesSync,
  findFilesFlatten,
  findFilesFlattenSync,
  ls,
  lsSync,
  lsStats,
  lsStatsSync,
};
