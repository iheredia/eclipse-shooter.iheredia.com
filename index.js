const { homeContent } = require('./static_files');
const express = require("express");
const staticFiles = require('./static_middleware');

const app = express();

app.get("/", (req, res) => res.send(homeContent));

app.use('/static', staticFiles);

app.get('*', (req, res) => res.send('Not found'))

module.exports = app;

