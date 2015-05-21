var IOPack = {
  init: function (server) {
    this.io = require('socket.io')(server);
    this.initChannels();
  },

  initChannels: function () {
    this.io.on('connection', function (socket) {

    });
  }
};

exports = module.exports = IOPack;
