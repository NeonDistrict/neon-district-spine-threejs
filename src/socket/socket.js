const socketIOClient = require('socket.io-client');

class Socket {
  constructor(_endpoint, _channel) {
    this.endpoint = _endpoint;
    this.channel = _channel;

    this.connectToSocket();
    this.connectToChannel();
  }

  connectToSocket() {
    this.socket = socketIOClient(this.endpoint + "/combat");
    this.socket.on("message", this.handleResponse.bind(this));
  }

  connectToChannel() {
    this.socket.emit('join', this.channel);
  }

  get(data) {
    this.socket.emit("get", this.channel);
  }

  run(data, callback, error = console.error) {
    this.socket.emit("run", this.channel, data);
  }

  handleResponse() {
    console.log("handleResponse");
    console.log(arguments);
    return arguments;
  }

  /*
  req(url, data, callback, error = console.error) {
    return axios.post(url, data).then(callback).catch(error);
  }

  getBattle(data, callback, error) {
    return this.req(this.endpoint + '/combat/combat/get', data, callback, error);
  }

  runBattle(data, callback, error) {
    return this.req(this.endpoint + '/combat/combat/run', data, callback, error);
  }
  */
}

export default Socket;
