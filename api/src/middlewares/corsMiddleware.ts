import cors from 'cors';
import config from '../config/config.js';

const corsOptions = () => {
  if (config.nodeEnv === 'production') {
    return {
      origin: [
        `http://${config.frontendOrigin}:${config.frontendPort}`,
        `https://${config.frontendOrigin}:${config.frontendPort}`,
      ],
      credentials: true,
      optionsSuccessStatus: 200,
    };
  } else if (config.nodeEnv === 'test') {
    return {
      origin: `http://localhost:${config.frontendPort}`,
      credentials: true,
      optionsSuccessStatus: 200,
    };
  } 
  return{
      origin: `http://localhost:${config.frontendPort}`,
      credentials: true,
      optionsSuccessStatus: 200,
    };
};

export const corsMiddleware = cors(corsOptions());