const axios = require('axios');

class Api {
  constructor(_endpoint) {
    this.endpoint = "";//_endpoint;

    if (window.location.href.indexOf('nds1-preview-tool')) {
      this.endpoint = 'http://3.212.225.158:5003'
    }
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
