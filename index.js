const express = require("express");
const fs = require('fs');
const staticFiles = require('./static');

const app = express();

const homeContent = fs.readFileSync('./index.html').toString();
app.get("/", (req, res) => res.send(homeContent));

app.use('/static', staticFiles);

app.get('*', (req, res) => res.send('Not found'))

module.exports = app;

