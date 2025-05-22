const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.API_PORT;

if (!port) {
  console.error('Error: SERVER_PORT environment variable is not set.');
  process.exit(1);
}

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from frontend
  credentials: true                // If using cookies or auth headers
}));

// Routes
const userRoutes = require('./routes/marquee_user')

// Allow JSON parsing (...and other middlewares)
app.use(express.json());

app.use('/api', userRoutes);


app.listen(port, () => {
  console.log(`API Server running at http://localhost:${port}`);
});