const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.FRONTEND_PORT || 3000;

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Serve environment variables as a JS file
app.get('/config.js', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  res.send(`
    window.env = {
      API_URL: "${process.env.API_URL}",
      API_KEY: "${process.env.API_KEY}"
    };
  `);
});

// Fallback to index.html for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend server running at http://localhost:${PORT}`);
});
