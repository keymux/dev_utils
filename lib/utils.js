const path = require("path");
const util = require("util");

const getStackLine = (options = {}) => {
  const list = getStackLineObjList();
  options.filter =
    options.filter ||
    (ele => {
      return ele.func === "Object.getStackLine";
    });

  return list[list.findIndex(options.filter) + 1 + (options.offset || 0)];
};

const getStackLineObjList = () => {
  const stackLineKeys = [null, "func", "file", "line", "char"];

  return new Error().stack
    .split("\n")
    .filter(line => line !== "Error")
    .map(fullLine => {
      return fullLine
        .split(/[\(\): \t]+/)
        .filter(piece => piece !== "")
        .reduce(
          (acc, columnValue, index) => {
            if (stackLineKeys[index] !== null) {
              acc[stackLineKeys[index]] = columnValue;
            }

            return acc;
          },
          { fullLine }
        );
    })
    .map(stackLine => {
      let filename = "";
      let dirname = "";

      try {
        filename = path.basename(stackLine.file);
        dirname = path.dirname(stackLine.file);
      } catch (err) {}

      return Object.assign(stackLine, {
        filename,
        dirname,
      });
    });
};

const helper = newKey => data => {
  if (Array.isArray(data)) {
    data[0][newKey] = data[1];

    return data[0];
  } else {
    const obj = {};

    obj[newKey] = data;

    return obj;
  }
};

const helper2 = newKey => data => {
  const obj = {};

  obj[newKey] = data;

  return obj;
};

const print = ele => {
  const line = getStackLine({
    filter: ele => ele.func === "print" && ele.file === __filename,
  });
  console.log(
    `${line.filename}.${line.line}:`,
    util.inspect(ele, { colors: true, depth: 3 })
  );

  return ele;
};

const rayHelper = (key, deepKey) => data => {
  // data currently contains n + 1 elements where n is the total number of promise results
  //
  // The first element is the data object we carry from promise to promise
  // All remaining elements are deepKey elements which need to be 'copy/pasted' into the correct key element
  //
  // In the resulting object:
  //   result[key] will be an array of objects
  //   result[key][0..n-1] will all contain a deepKey element which will be shifted from the data object
  const obj = data.shift() || {};

  obj[key] = obj[key].map(ele => {
    ele[deepKey] = data.shift();

    return ele;
  });

  return obj;
};

const unhandledPromiseRejectionHandler = (reason, promise) => {
  print("Unhandled rejection");
  print(reason);

  process.exit(1);
};

module.exports = {
  getStackLine,
  getStackLineObjList,
  helper,
  helper2,
  print,
  rayHelper,
  unhandledPromiseRejectionHandler,
};
