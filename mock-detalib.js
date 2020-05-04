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

const databases = {};
class Database {
  constructor(name) {
    const dbName = name || 'default';
    if (!databases[dbName]) {
      databases[dbName] = {};
    }
    this.db = databases[dbName];
  }

  put(key, value) {
    this.db[key] = value;
  }

  all() {
    return Object.entries(this.db).map(([key, data]) => ({ key, data }))
  }
}

module.exports = {
  files,
  Database,
};
