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

module.exports = { helper, helper2, rayHelper };
