const pg = require('pg');

const conString = "postgres://postgres:postgres@localhost:5432/postgres";
const client = new pg.Client(conString);
client.connect();

module.exports = client;