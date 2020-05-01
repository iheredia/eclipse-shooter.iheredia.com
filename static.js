const { files } = process.env.DETA_EMULATED ? require('./mock-detalib') : require('detalib');
const express = require('express');
const router = express.Router();
const fs = require('fs');

['styles.css', 'main.js'].map(filename => {
  const fileContent = fs.readFileSync(filename);
  files.put(filename, fileContent)
});

const getContentType = (filename) => {
  if (filename.endsWith('.css')) {
    return 'text/css'
  } else if (filename.endsWith('.js')) {
    return 'text/javascript'
  }
  return 'text/plain'
}

router.get('/:filename', async (req, res) => {
  const { filename } = req.params;
  try {
    const file = await files.get(filename);
    res.setHeader('content-type', getContentType(filename));
    res.send(file.toString());
  } catch (e) {
    res.send(`File ${filename} not found`);
  }
});

module.exports = router;
