require('dotenv').config({ path: '.env' });

require('module-alias').addAliases({
  '~': __dirname,
  '@src': `${__dirname}/src`,
});
const bcrypt = require('bcrypt');
const SocketIo = require('socket.io');
const { Auth, checkUser } = require('@src/middlewares/auth.middleware');
const DBConn = require('@src/utils/connector.util');
const { app, http } = require('./bootstrap');

const sessions = {};
DBConn.connect();

const io = SocketIo(http, {
  allowEIO3: true,
  cors: {
    origin: true,
    credentials: true,
  },
});

io.sockets.on('connection', async (socket) => {
  const { uid, username, password } = socket.handshake.query;
  const user = await checkUser(username, password);
  if (user) {
    sessions[uid] = socket;
    socket.emit('connected', { uid });
  } else {
    socket.emit('error', { message: 'Invalid credentials' });
  }
  socket.on('disconnect', () => {
    delete sessions[uid];
  });
});

app.post('/encrypt', async (req, res) => {
  const { value } = req.body;
  const hash = bcrypt.hashSync(value, 10);
  res.send(hash);
});

app.post('/socket-emit', Auth, (req, res) => {
  const uid = req.body.socket_id;
  const event = req.body.event;
  const data = req.body.data;
  const socket = sessions[uid];
  if (socket) {
    socket.emit(event, data);
  }
  res.send(true);
});
