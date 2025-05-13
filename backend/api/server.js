const express = require('express');
const path = require('path');
console.log('Loading env from:', path.resolve(__dirname, '.backend.env'));
require('dotenv').config({ path: path.resolve(__dirname, '.backend.env') });

const app = express();
const port = process.env.SERVER_PORT || 80;

// Routes
const userRoutes = require('./routes/marquee_user')

app.use(express.json());

app.use('/api', userRoutes);


app.listen(port, () => {
  console.log(`API Server running at http://localhost:${port}`);
});