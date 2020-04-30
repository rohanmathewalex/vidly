const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging');
require('./startup/routes')(app)//mhere it return a finction so we pass app as object
require('./startup/db')();
require('./startup/config')();
require('./startup/validaton');

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`)); 