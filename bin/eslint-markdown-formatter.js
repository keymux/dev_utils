const formatter = results => {
  require("../index")
    .simple.eslint.fullSummary(results)
    .forEach(result => console.log(result)); // eslint-disable-line no-console
};

module.exports = formatter;
