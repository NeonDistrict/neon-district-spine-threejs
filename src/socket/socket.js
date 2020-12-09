const socketIOClient = require('socket.io-client');

class Socket {
  constructor(_endpoint, _channel) {
    this.socket = socketIOClient(_endpoint + "/combat", {
      withCredentials: true
    });
    this.connectToChannel(_channel);
  }

  connectToChannel(channel) {
    this.socket.emit('join', channel);
  }

  setGetResponse(callback) {
    this.socket.on("getResponse", callback);
  }

  setOptionsResponse(callback) {
    this.socket.on("optionsResponse", callback);
  }

  get(channel, data) {
    this.socket.emit("get", channel);
  }

  create(teamId, data) {
    this.socket.emit("create", teamId, data);
  }

  run(channel, data) {
    this.socket.emit("run", channel, data);
  }
}

export default Socket;
