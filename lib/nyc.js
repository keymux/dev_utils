const fs = require("fs");
const path = require("path");

const mapTotalToTable = (coverageSummary, userOptions) => {
  const options = {};

  options.pre = userOptions.pre
    ? userOptions.pre.split(",")
    : ["**", "", "**", "", "*__"];
  options.post = userOptions.post
    ? userOptions.post.split(",")
    : ["**", "", "**", "", "%__*"];

  options.tableHeader =
    userOptions.tableHeader || "Type,Covered,Skipped,Total,Percent";

  const divider = "------|------|------|------|------";

  const total = coverageSummary.total;
  const keys = Object.keys(total);

  return [options.tableHeader.split(",").join("|"), divider]
    .concat(
      keys.map(key =>
        [
          options.pre[0] +
            key.charAt(0).toUpperCase() +
            key.slice(1) +
            options.post[0],
          options.pre[1] + total[key].covered + options.post[1],
          options.pre[2] + total[key].skipped + options.post[2],
          options.pre[3] + total[key].total + options.post[3],
          options.pre[4] + total[key].pct + options.post[4],
        ].join("|")
      )
    )
    .join("\n");
};

const nycToMarkdown = userOptions => {
  return new Promise(resolve => {
    const options = {};

    options.header = userOptions.header;
    options.footer = userOptions.footer;
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

    if (options.footer) {
      console.log(options.footer);
      console.log();
    }

    resolve(0);
  });
};

module.exports = {
  mapTotalToTable,
  nycToMarkdown,
};
