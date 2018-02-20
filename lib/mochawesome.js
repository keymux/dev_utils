const path = require("path");

const statsToMarkdown = userOptions => {
  return new Promise(resolve => {
    const options = {};

    options.header = userOptions.header;

    options.tableHeader =
      userOptions.tableHeader || "Passed,Failed,Skipped,Total,Percent";
    options.fields = userOptions.fields
      ? userOptions.fields.split(",")
      : ["passes", "failures", "pending", "tests", "passPercent"];
    options.pre = userOptions.pre
      ? userOptions.pre.split(",")
      : ["", "*__", "*", "", ""];
    options.post = userOptions.post
      ? userOptions.post.split(",")
      : ["", "__*", "*", "", "%"];
    options.mochawesome_json = userOptions.mochawesome_json;

    options.footer = userOptions.footer;

    const stats = require(path.resolve(options.mochawesome_json)).stats;

    if (options.header) {
      console.log(options.header);
      console.log(); // Empty line
    }

    console.log(options.tableHeader.split(",").join("|"));
    console.log("------|------|------|------|------");
    console.log(
      options.fields
        .map(
          (field, index) =>
            options.pre[index] + stats[field] + options.post[index]
        )
        .join("|")
    );

    if (options.footer) {
      console.log(); // Empty line
      console.log(options.footer);
    }

    resolve();
  });
};

module.exports = {
  statsToMarkdown,
};
