const uniqueConcat = (a, b) =>
  a.concat(
    b.filter(item => {
      return a.indexOf(item) < 0;
    })
  );

const containsDuplicates = array => {
  for (let i = array.length - 1; i > 0; --i) {
    if (array.indexOf(array[i]) !== i) {
      return true;
    }
  }

  return false;
};

module.exports = { containsDuplicates, uniqueConcat };
