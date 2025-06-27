import config from "../config/config.js";
import { Client } from 'pg';

const client = new Client(config.clientConfig);

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
    if (err instanceof Error) {
      throw new Error(`${msg}: ${err.message}`);
    } else {
      throw new Error(`${msg}: ${JSON.stringify(err)}`);
    }
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
    if (err instanceof Error) {
      throw new Error(`${msg}: ${err.message}`);
    } else {
      throw new Error(`${msg}: ${JSON.stringify(err)}`);
    }
  }
}

/**
 * Query the database
 * 
 * @param {string} sql - The SQL query string with placeholders for parameters.
 * @param {Array} [params] - Optional array of parameters to substitute into the query.
 * @returns {Promise<Object>} - A Promise that resolves to the query result object.
 */
function query(sql: string, params?: unknown[]) {
  return client.query(sql, params);
}

const db = {
  client,
  connect,
  disconnect,
  query
};

export default db;