const fullSummary = files => {
  const filesSummary = summary(files);
  if (files.length === 0) {
    return filesSummary;
  }

  const filesRulesSummary = ruleSummary(files);

  return filesSummary.concat(["\n"].concat(filesRulesSummary));
};

const summary = files => {
  const INITIAL_COUNTS = {
    Warnings: 0,
    Errors: 0,
  };

  const counts = files.reduce((acc, file) => {
    acc.Warnings += file.warningCount;
    acc.Errors += file.errorCount;

    return acc;
  }, INITIAL_COUNTS);

  return ["Type | Count", "--- | ---"].concat(
    Object.keys(counts).map(key => [key, counts[key]].join("|"))
  );
};

const ruleSummary = files => {
  if (files.length === 0) {
    return [];
  }

  const INITIAL_COUNTS = {};

  const counts = files.reduce((acc, file) => {
    return file.messages
      .map(message => message.ruleId)
      .reduce((innerAcc, rule) => {
        if (innerAcc[rule] !== undefined) {
          ++innerAcc[rule];
        } else {
          innerAcc[rule] = 1;
        }

        return innerAcc;
      }, acc);
  }, INITIAL_COUNTS);

  return ["Rule | Count", "--- | ---"].concat(
    Object.keys(counts).map(key => [key, counts[key]].join("|"))
  );
};

module.exports = {
  fullSummary,
  summary,
  ruleSummary,
};
