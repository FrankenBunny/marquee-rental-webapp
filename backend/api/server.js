const express = require('express');
const cors = require("cors");
require('dotenv').config();

const app = express();
const port = process.env.API_PORT;

if (!port) {
  console.error('Error: API_PORT environment variable is not set.');
  process.exit(1);
}

// Enable CORS for development environment
if (process.env.NODE_ENV === 'development') {
  const frontendPort = process.env.FRONTEND_PORT;
  
  app.use(cors({
    origin: `http://localhost:${frontendPort}`,
    credentials: true,
    optionsSuccessStatus: 200
  }));

  console.log(`CORS enabled for development at http://localhost:${frontendPort}`);

} else if (process.env.NODE_ENV === 'production') {
  const frontendPort = process.env.FRONTEND_PORT;
  const frontendOrigin = process.env.FRONTEND_ORIGIN; 

  app.use(cors({
    origin: [`http://${frontendOrigin}:${frontendPort}`, `https://${frontendOrigin}:${frontendPort}`],
    credentials: true,
    optionsSuccessStatus: 200
  }));

  console.log(`CORS enabled for production: http://${frontendOrigin}:${frontendPort}`);
}

// Routes
const userRoutes = require('./routes/marquee_user')

app.use(express.json());

app.use('/api', userRoutes);


app.listen(port, () => {
  console.log(`API Server running at http://localhost:${port}`);
});