const formatPatchesForComment = (patches, opts) => {
  let start = "";
  let body = "";
  let end = "";

  start = "```diff\n";
  end = "```";

  body = patches
    .map(patch => {
      let filename = patch.oldFile().path();

      if (patch.oldFile().path() !== patch.newFile().path()) {
        filename = `${filename} ==> ${patch.newFile().path()}`;
      }

      return (
        filename +
        "\n" +
        patch.linesRay
          .map(line => {
            if (line.oldLineno() === -1) {
              return "+" + line.content();
            } else if (line.newLineno() === -1) {
              return "-" + line.content();
            } else {
              return "?" + line.content();
            }
          })
          .join("")
      );
    })
    .join("\n");

  return `${start}${body}${end}`;
};

module.exports = { formatPatchesForComment };
