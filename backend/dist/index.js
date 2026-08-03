const express = require('express');
const path = require('path');

const app = express();
const distDir = __dirname;

app.use(express.static(distDir));

app.get('*', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

module.exports = app;
