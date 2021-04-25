// inside index.js
const { PORT = 3000 } = process.env
const express = require('express');
const server = express();

require('dotenv').config();

server.use(express.json());

const morgan = require('morgan');
server.use(morgan('dev'));

const apiRouter = require('./api');
server.use('/api', apiRouter);

const client = require('./db/client');
client.connect();

server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});