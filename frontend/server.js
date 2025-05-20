const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.FRONTEND_PORT;

if (!port) {
  console.error('Error: FRONTEND_PORT environment variable is not set.');
  process.exit(1);
}

app.use(express.static('pages'));
app.use(express.static('css'));
app.use(express.static('js'));

app.get('/config.js', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  res.send(`
    window.env = {
      API_URL: "${process.env.API_URL}",
    };
  `);
});

console.log(path.join(__dirname, 'pages/index.html'));

app.get('/{*any}', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/index.html'), (err) => {
    if (err) {
      console.error('Error sending index.html:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});

app.listen(port, () => {
  console.log(`Frontend server running at http://localhost:${port}`);
});
