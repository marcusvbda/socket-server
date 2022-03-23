const mongoose = require('mongoose');
const debug = require('console-development');

const connector = {
  instance: null,
  getUri() {
    const uri = process.env.MONGO_URI;
    return uri;
  },
  async connect(options = { show_log: true }) {
    const mongoAtlasUri = this.getUri();

    if (options.show_log) {
      mongoose.connection.on('error', (err) => {
        debug.log('mongoose error on connection', err);
      });

      mongoose.connection.on('connected', () => {
        debug.log('mongoose is connected');
      });
    }

    this.instance = await mongoose.connect(mongoAtlasUri, {
      useNewUrlParser: 'true',
    });

    return this.instance;
  },
  close() {
    mongoose.connection.close();
  },
  getConnectionState() {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    return states[this.instance.connection.readyState];
  },
};

module.exports = connector;
