const express = require('express');
const app = express();

app.set("port", process.env.PORT || 3000);

app.use(require('./routes/login'))

module.exports = app;