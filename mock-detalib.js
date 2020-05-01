const savedFiles = {};

const files = {
  put: (filename, fileContent) => {
    savedFiles[filename] = fileContent;
  },
  get: (filename) => {
    if (savedFiles[filename]) {
      return savedFiles[filename]
    }
    throw Error('File not found');
  },
};
module.exports = {
  files,
};
