const removeDuplicate = (array) => {
  let unique = array.reduce(function (acc, curr) {
    if (!acc.includes(curr)) acc.push(curr);
    return acc;
  }, []);
  return unique;
};

module.exports = {
  removeDuplicate,
};
