#!/usr/bin/env node

const git = require('nodegit');

const main = () => {
  return git.Repository.open('./')
    .then(repo => {
      return Promise.all([repo, repo.index()]);
    })
    .then(data => {
      console.log('11');
      console.log(JSON.stringify(data, null, 2));
      return Promise.all([data, data[0].getReference('master')]);
    })
    .then(data => {
      return Promise.all([
        data,
        git.Diff.indexToIndex(data[0], data[2], data[1]),
      ]);
    })
    .then(data => {
      console.log('28Hello world!');
      console.log(JSON.stringify(data, null, 2));
    })
    .catch(err => {
      console.error(err);
    });
};

main();
