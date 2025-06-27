import app from "./app.js";
import config from "./config/config.js";
import db from "./db/client.js";

async function startServer() {
  try {
    await db.connect();

    if (config.nodeEnv !== 'test') {
      app.listen(config.port, () => {
        console.log(`API Server running at http://localhost:${config.port}`);
      });
    }
  } catch (err) {
    console.error('Failed to connect to DB:', err);
    process.exit(1);
  }
}

startServer();