import config from "../config/config.js";
import { Client, Pool } from "pg";

const client = new Client(config.clientConfig);
const pool = new Pool(config.clientConfig);

/**
 * Attempts to connect to the PostgreSQL database.
 *
 * ⚠️ *Special-use only*: Establishes a direct connection to the PostgreSQL database using a single client.
 *
 * @returns {Promise<void>}
 * @throws {Error} if unable to disconnect, including err
 * @see disconnect()
 */
async function connect() {
  try {
    await client.connect();
  } catch (err) {
    const msg = "❌ Failed to connect to PostgreSQL database";
    if (err instanceof Error) {
      throw new Error(`${msg}: ${err.message}`);
    } else {
      throw new Error(`${msg}: ${JSON.stringify(err)}`);
    }
  }
}

/**
 * Disconnects from the PostgreSQL database.
 *
 * ⚠️ *Special-use only*: Closes the single client connection to the PostgreSQL database.
 *
 * @returns {Promise<void>}
 * @throws {Error} if unable to disconnect, including err
 * @see connect()
 */
async function disconnect() {
  try {
    await client.end();
  } catch (err) {
    const msg = "❌ Failed to disconnect from PostgreSQL database";
    if (err instanceof Error) {
      throw new Error(`${msg}: ${err.message}`);
    } else {
      throw new Error(`${msg}: ${JSON.stringify(err)}`);
    }
  }
}

/**
 * Query the database using pool
 *
 * @param {string} sql - The SQL query string with placeholders for parameters.
 * @param {Array} [params] - Optional array of parameters to substitute into the query.
 * @returns {Promise<Object>} - A Promise that resolves to the query result object.
 */
async function query(sql: string, params?: unknown[]) {
  return pool.query(sql, params);
}

const db = {
  connect,
  disconnect,
  query,
};

export default db;
