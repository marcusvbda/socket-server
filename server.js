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

io.sockets.on('connection', (socket) => {
  socket.emit('connected', { id: socket.id });
  socket.on('join', async ({ username, password }) => {
    const user = await checkUser(username, password);
    if (user) {
      sessions[socket.id] = socket;
      socket.emit('joined', { id: socket.id });
    } else {
      socket.emit('error', { message: 'Invalid username or password' });
    }
  });
  socket.on('disconnect', () => {
    delete sessions[socket.id];
  });
});

app.post('/encrypt', async (req, res) => {
  const { value } = req.body;
  const hash = bcrypt.hashSync(value, 10);
  res.send(hash);
});

app.post('/socket-emit', Auth, (req, res) => {
  const socketId = req.body.socket_id;

  const socket = sessions[socketId];
  if (socket) {
    const event = req.body.event;
    const data = req.body.data;
    socket.emit(event, data);
  }
  res.send(true);
});
