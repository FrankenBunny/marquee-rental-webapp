require('dotenv').config();

const { Client } = require('pg');

const dbConfig = {
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.DB_PORT,
};

const client = new Client(dbConfig);

/**
 * Attempts to connect to the PostgreSQL database.
 * @returns {Promise<void>}
 * @throws {Error} if unable to disconnect, including err
 */
async function connect() {
  try {
    await client.connect();
  } catch (err) {
    const msg = '❌ Failed to connect to PostgreSQL database';
    throw new Error(`${msg}: ${err.message}`);
  }
}

/**
 * Disconnects from the PostgreSQL database.
 * @returns {Promise<void>}
 * @throws {Error} if unable to disconnect, including err
 */
async function disconnect() {
  try {
    await client.end();
  } catch (err) {
    const msg = '❌ Failed to disconnect from PostgreSQL database';
    throw new Error(`${msg}: ${err.message}`);
  }
}

/**
 * Query the database
 * 
 * @param {string} sql - The SQL query string with placeholders for parameters.
 * @param {Array} [params] - Optional array of parameters to substitute into the query.
 * @returns {Promise<Object>} - A Promise that resolves to the query result object.
 */
function query(sql, params) {
  return client.query(sql, params);
}

module.exports = {
  client, 
  connect, 
  disconnect,
  query
};