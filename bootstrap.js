const express = require('express');

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');

app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  next();
});

const bodyParser = require('body-parser');
const debug = require('console-development');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json('api is running ...');
});

app.post('/postback-mockup', async (req, res) => {
  const params = req.body;
  debug.log('postback mockup', params);
  res.json(params);
});

http.prependListener('request', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
  debug.log(`http://localhost:${port}`);
});

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  app,
  http,
  isProduction,
};
