const express = require("express");
const app = express();

const staticFiles = require('./static');
const layout = require('./layout');

app.use('/static', staticFiles);

app.get("/", (req, res) => {
  res.send(layout({ body: '<h1>Hello world</h1>' }));
});

app.get('*', (req, res) => res.send('Not found'))

module.exports = app;

