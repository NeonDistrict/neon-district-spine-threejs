const axios = require('axios');

class Api {
  constructor(_endpoint) {
    this.endpoint = "";//_endpoint;
  }

  req(url, data, callback, error = console.error) {
    return axios.post(url, data).then(callback).catch(error);
  }

  getBattle(data, callback, error) {
    return this.req(this.endpoint + '/api/combat/get', data, callback, error);
  }

  runBattle(data, callback, error) {
    return this.req(this.endpoint + '/api/combat/run', data, callback, error);
  }
}

export default Api;
