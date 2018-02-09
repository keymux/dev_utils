const bitbucket = require("./bitbucket");
const { Diff, Repository } = require("nodegit");
const { helper, helper2, rayHelper } = require("./utils");

const formatPatches = (patches, opts) => {
  if (opts.bitbucketComment === true) {
    return bitbucket.formatPatchesForComment(patches, opts);
  }

  throw new Error("Patch format not implemented");
};

const diffCurrentIndexWithMaster = repoPath => {
  return Repository.open(repoPath)
    .then(helper("repo"))
    .then(data => Promise.all([data, getMasterTree(data.repo)]))
    .then(helper("masterTree"))
    .then(data => Promise.all([data, data.repo.index()]))
    .then(helper("currentIndex"))
    .then(data =>
      Promise.all([
        data,
        Diff.treeToIndex(data.repo, data.masterTree, data.currentIndex),
      ])
    );
};

const diffCurrentWorkdirWithMaster = repoPath => {
  return Repository.open(repoPath)
    .then(helper("repo"))
    .then(data => Promise.all([data, getMasterTree(data.repo)]))
    .then(helper("masterTree"))
    .then(data => {
      return Promise.all([
        data,
        Diff.treeToWorkdir(data.repo, data.masterTree),
      ]);
    })
    .then(helper("diff"));
};

const getMasterTree = repo => {
  return repo.getMasterCommit().then(commit => commit.getTree());
};

const getHeadTree = repo => {
  return repo.getHeadCommit().then(commit => commit.getTree());
};

const diffCurrentHeadWithMaster = repoPath => {
  return Repository.open(repoPath)
    .then(helper("repo"))
    .then(data => Promise.all([data, getMasterTree(data.repo)]))
    .then(helper("masterTree"))
    .then(data => Promise.all([data, getHeadTree(data.repo)]))
    .then(helper("headTree"))
    .then(data =>
      Promise.all([
        data,
        Diff.treeToTree(data.repo, data.masterTree, data.headTree),
      ])
    )
    .then(data => data[1]);
};

const getChanges = (diff, opts = {}) => {
  if (
    opts.patchesFilter === undefined ||
    !(opts.patchesFilter instanceof Function)
  ) {
    console.log("Default filter set");
    opts.patchesFilter = () => true;
  }

  return diff
    .patches()
    .then(helper2("patches"))
    .then(data => {
      return data.patches.filter(opts.patchesFilter);
    })
    .then(patches => {
      const promises = [];

      promises.push({ patches });

      return Promise.all(promises.concat(patches.map(patch => patch.hunks())));
    })
    .then(rayHelper("patches", "hunksRay"))
    .then(data => {
      let promises = [];

      promises.push(data);

      promises = promises.concat(
        data.patches
          .map(patch => {
            return patch.hunksRay;
          })
          .reduce((acc, hunksRay) => {
            acc = acc.concat(hunksRay.map(hunk => hunk.lines()));
            return acc;
          }, [])
      );

      return Promise.all(promises);
    })
    .then(rayHelper("patches", "linesRay"));
};

module.exports = {
  diffCurrentHeadWithMaster,
  diffCurrentIndexWithMaster,
  diffCurrentWorkdirWithMaster,
  formatPatches,
  getChanges,
  getHeadTree,
  getMasterTree,
};
