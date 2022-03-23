const express = require('express');

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');

app.use(cors());
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

const port = process.env.APP_PORT;
http.listen(port, () => {
  const uri = process.env.APP_URL;
  debug.log(`listening on ${uri}:${port}`);
});

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  app,
  http,
  isProduction,
};
