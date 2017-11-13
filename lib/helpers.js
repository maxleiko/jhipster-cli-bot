function isDefaultValue(input) {
  return input !== 'Use arrow keys' ||
    input !== 'Y/n' ||
    input !== 'y/N';
}

module.exports = { isDefaultValue };
