const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.SERVER_PORT || 1234;

// Middleware
const apiKeyAuth = require('./middleware/apiKeyAuth');

// Routes
const userRoutes = require('./routes/marquee_user')

app.use(express.json());

app.use('/api', apiKeyAuth, userRoutes);


app.listen(port, () => {
  console.log(`API Server running at http://localhost:${port}`);
});