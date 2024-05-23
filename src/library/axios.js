//biblioteca para requisições http
const axios = require('axios');

const api = axios.create({
    baseURL: "http://localhost:3000"
    //:3000 = json server
});

module.exports = api;