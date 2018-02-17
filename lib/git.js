const { Diff, Repository } = require("nodegit");
const { helper, helper2, print, rayHelper } = require("./utils");

const diffCurrentIndexWithMaster = repoPath => {
  return getRepo(repoPath)
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
  return getRepo(repoPath)
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

const getReference = (repo, ref) => {
  return repo.getReference(ref);
};

const getReferenceTarget = (repo, ref) => {
  return getReference(repo, ref).then(reference => reference.target());
};

const getReferenceCommit = (repo, ref) => {
  return getReferenceTarget(repo, ref).then(target => repo.getCommit(target));
};

const getReferenceTree = (repo, ref) => {
  return getReferenceCommit(repo, ref).then(commit => commit.getTree());
};

const getMasterCommit = repo => {
  return repo.getMasterCommit();
};

const getMasterTree = repo => {
  return getMasterCommit(repo).then(commit => commit.getTree());
};

const getHeadCommit = repo => {
  return repo.getHeadCommit();
};

const getHeadTree = repo => {
  return getHeadCommit(repo).then(commit => commit.getTree());
};

const diffCurrentHeadWithReference = (repoPath, ref, opts = {}) => {
  return getRepo(repoPath)
    .then(data =>
      Promise.all([
        data.repo,
        getReferenceTree(data.repo, ref),
        getHeadTree(data.repo),
      ])
    )
    .then(data => Diff.treeToTree(data[0], data[1], data[2], opts.diffOpts));
};

const diffCurrentHeadWithMaster = repoPath => {
  return getRepo(repoPath)
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
    print("Default filter set");
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

const getRepo = repoPath => {
  return Repository.open(repoPath).then(helper("repo"));
};

module.exports = {
  diffCurrentHeadWithReference,
  getChanges,
  getHeadCommit,
  getHeadTree,
  getMasterCommit,
  getMasterTree,
  getReference,
  getReferenceTarget,
  getReferenceCommit,
  getReferenceTree,
  getRepo,
};
