#!/usr/bin/env node

const {
  diffCurrentHeadWithReference,
  formatPatches,
  getChanges,
} = require("../lib/git");

const { print, unhandledPromiseRejectionHandler } = require("../lib/utils");
print(null);
print(null);
print(null);
print(null);

process.on("unhandledRejection", unhandledPromiseRejectionHandler);

const main = () => {
  const patchesFilter = patch => {
    return patch
      .newFile()
      .path()
      .startsWith(".changes");
  };

  const diffOpts = { contextLines: 0 };

  //return diffCurrentWorkdirWithMaster("./.git")
  //return diffCurrentHeadWithMaster("./.git")
  return diffCurrentHeadWithReference("./.git", "refs/heads/master", {
    diffOpts,
  })
    .then(diff => getChanges(diff, { patchesFilter }))
    .then(data => {
      if (!data.patches || data.patches.length === 0) {
        console.log("No changes were found");

        throw new Error("No changes were found");
      }

      console.log(formatPatches(data.patches, { bitbucketComment: true }));
    });
};

main()
  .then()
  .catch(err => {
    print(err);

    //process.exit(-1);
  });
