const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.API_PORT;

if (!port) {
  console.error('Error: SERVER_PORT environment variable is not set.');
  process.exit(1);
}

// Routes
const userRoutes = require('./routes/marquee_user')

app.use(express.json());

app.use('/api', userRoutes);


app.listen(port, () => {
  console.log(`API Server running at http://localhost:${port}`);
});