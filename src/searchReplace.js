module.exports = function(mapping, toReplace) {
  for (let key in mapping) {
    let len = key.length;

    if (toReplace.substr(0, len) === key)
      return `${mapping[key]}${toReplace.substr(len)}`;
  }

  throw new Error("No match found!");
};
