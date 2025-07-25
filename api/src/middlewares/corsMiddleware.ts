import cors from "cors";
import config from "../config/config.js";

const corsOptions = () => {
  if (config.nodeEnv === "production") {
    console.log(`CORS: http://${config.frontendOrigin}:${config.frontendPort}`);
    return {
      origin: [
        `http://${config.frontendOrigin}:${config.frontendPort}`,
        `https://${config.frontendOrigin}:${config.frontendPort}`,
        `http://${config.frontendOrigin}`,
      ],
      credentials: true,
      optionsSuccessStatus: 200,
    };
  } else if (config.nodeEnv === "test") {
    return {
      origin: `http://localhost:${config.frontendPort}`,
      credentials: true,
      optionsSuccessStatus: 200,
    };
  }
  return {
    origin: `http://localhost:${config.frontendPort}`,
    credentials: true,
    optionsSuccessStatus: 200,
  };
};

export const corsMiddleware = cors(corsOptions());
