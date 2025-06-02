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
  const frontend_port = process.env.FRONTEND_PORT;

  app.use(cors({
    origin: `http://localhost:${frontend_port}`,
    credentials: true
  }));

  console.log(`CORS enabled for development at http://localhost:${frontend_port}`);
}

// Routes
const userRoutes = require('./routes/marquee_user')

app.use(express.json());

app.use('/api', userRoutes);


app.listen(port, () => {
  console.log(`API Server running at http://localhost:${port}`);
});