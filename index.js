const express = require("express");
const app = express();
require('express-ws')(app);

const staticFiles = require('./static');
app.use('/static', staticFiles);

const fs = require('fs');
const homeContent = fs.readFileSync('./index.html').toString();
app.get("/", (req, res) => res.send(homeContent));

app.get('*', (req, res) => res.send('Not found'))

module.exports = app;

