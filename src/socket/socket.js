const socketIOClient = require('socket.io-client');

class Socket {
  constructor(_endpoint, _channel) {
    this.socket = socketIOClient(_endpoint + "/combat");
    this.connectToChannel(_channel);
  }

  connectToChannel(channel) {
    this.socket.emit('join', channel);
  }

  setGetResponse(callback) {
    this.socket.on("getResponse", callback);
  }

  setRunResponse(callback) {
    this.socket.on("runResponse", callback);
  }

  get(channel, data) {
    this.socket.emit("get", channel);
  }

  run(channel, data) {
    this.socket.emit("run", channel, data);
  }
}

export default Socket;
