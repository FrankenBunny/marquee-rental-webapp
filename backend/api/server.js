const express = require('express');
const cors = require("cors");
require('dotenv').config();

const app = express();
const port = process.env.API_PORT;
const frontendOrigin = process.env.FRONTEND_ORIGIN;
const frontendPort = process.env.FRONTEND_PORT;

// Enable CORS for development environment
if (process.env.NODE_ENV === 'development') {
  if (!port) {
    console.error('Error: API_PORT environment variable is not set.');
    process.exit(1);
  } else {
    app.use(cors({
      origin: `http://localhost:${frontendPort}`,
      credentials: true,
      optionsSuccessStatus: 200
    }));
  }

  console.log(`CORS enabled for development at http://localhost:${frontendPort}`);

} else if (process.env.NODE_ENV === 'production') {
  if (!port) {
    console.error('Error: API_PORT environment variable is not set.');
    process.exit(1);
  } else {
    app.use(cors({
      origin: [`http://${frontendOrigin}:${frontendPort}`, `https://${frontendOrigin}:${frontendPort}`],
      credentials: true,
      optionsSuccessStatus: 200
    }));
  }

  console.log(`CORS enabled for production: http://${frontendOrigin}:${frontendPort}`);
} else if (process.env.NODE_ENV === 'test') {
  if (!port) {
    console.error('Error: API_PORT environment variable is not set.');
    process.exit(1);
  } else {
    app.use(cors({
      origin: `http://localhost:${frontendPort}`,
      credentials: true,
      optionsSuccessStatus: 200
    }));
  }
}

/* 
 * -- Middlewares --
 *
 * - JSON Formatting
 */
app.use(express.json());

/*
 * -- Routes --
 *
 * Authentication & Authorization
 * - userRoutes
 *     Complete CRUID for user management.
 * 
 * Inventory Management System
 * - rentableroutes
 *     Complete CRUD for rentable management.
 */
const userRoutes = require('./routes/marquee_user')
const rentableRoutes = require('./routes/inventory/rentable')

app.use('/api', userRoutes);
app.use('/api', rentableRoutes);

if (process.env.NODE_ENV != 'test') {
  app.listen(port, () => {
    console.log(`API Server running at http://localhost:${port}`);
  });
}


module.exports = app;