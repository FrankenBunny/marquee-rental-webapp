const path = require('path');
console.log('Loading env from:', path.resolve(__dirname, '.backend.env'));
require('dotenv').config({ path: path.resolve(__dirname, '.backend.env') });

const { Client } = require('pg');

const dbConfig = {
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.DB_PORT,
};

const client = new Client(dbConfig);

client.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Error connecting to PostgreSQL database', err));

module.exports = client;