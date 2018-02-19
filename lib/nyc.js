const fs = require("fs");
const path = require("path");

const mapTotalToTable = (coverageSummary, userOptions) => {
  const options = {};

  const tableHeader =
    options.tableHeader || "Type|Covered|Skipped|Total|Percent";
  const divider = "------|------|------|------|------";

  const total = coverageSummary.total;
  const keys = Object.keys(total);

  return [tableHeader, divider]
    .concat(
      keys.map(key =>
        [
          key.charAt(0).toUpperCase() + key.slice(1),
          total[key].covered,
          total[key].skipped,
          total[key].total,
          total[key].pct,
        ].join("|")
      )
    )
    .join("\n");
};

const nycToMarkdown = userOptions => {
  return new Promise(resolve => {
    const options = {};

    options.header = userOptions.header;
    options.coverage_filename =
      userOptions.coverage_filename || "./coverage/coverage-summary.json";

    const coverageSummary = require(path.resolve(
      userOptions.coverage_filename
    ));

    if (options.header) {
      console.log(options.header);
      console.log();
    }

    console.log(mapTotalToTable(coverageSummary, userOptions));
    console.log();

    resolve(0);
  });
};

module.exports = {
  mapTotalToTable,
  nycToMarkdown,
};
