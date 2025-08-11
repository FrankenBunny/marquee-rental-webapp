import app from "./app.js";
import config from "./config/config.js";

async function startServer() {
  try {
    if (config.nodeEnv !== "test") {
      app.listen(config.port, () => {
        console.log(`API Server running at http://localhost:${config.port}`);
      });
    }
  } catch (err) {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  }
}

startServer();
