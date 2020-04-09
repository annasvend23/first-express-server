const fs = require('fs').promises;

const readFile = (path) => fs.readFile(path, { encoding: 'utf8' })
  .then((str) => JSON.parse(str));

module.exports = readFile;
