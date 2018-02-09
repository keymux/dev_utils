#!/usr/bin/env node

const util = require("util");

const {
  diffCurrentHeadWithMaster,
  formatPatches,
  getChanges,
} = require("../lib/git");

const getStackLine = (num, options) => {
  const line = new Error().stack.split("\n")[num];
  const colSplit = line.split(":");

  return {
    lineNum: colSplit[colSplit.length - 2],
    charNum: colSplit[colSplit.length - 1],
  };
};

const print = ele => {
  console.log(
    getStackLine(3).lineNum + ":",
    util.inspect(ele, { colors: true, depth: 3 })
  );
};

const main = () => {
  const patchesFilter = patch => {
    return patch
      .newFile()
      .path()
      .startsWith(".changes");
  };

  //return diffCurrentWorkdirWithMaster("./.git")
  return diffCurrentHeadWithMaster("./.git")
    .then(diff => getChanges(diff, { patchesFilter }))
    .then(data => {
      console.log(formatPatches(data.patches, { bitbucketComment: true }));
      console.log();
    })
    .catch(err => {
      console.error(err);
    });
};

main();
