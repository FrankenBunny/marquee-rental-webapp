const express = require('express');
const router = express.Router();
const db = require('../db');
const { isValidEmail } = require('../services/Regex');

/*
 * 
 * CREATE TABLE app_user (
 *      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *      username VARCHAR(32) NOT NULL UNIQUE,
 *      name VARCHAR(100) NOT NULL,
 *      email VARCHAR(254) NOT NULL UNIQUE,
 *      password_hash VARCHAR(255) NOT NULL,
 *      created_at TIMESTAMPTZ DEFAULT now()
 * );
 * 
 */

router.post('/user', async (req, res) => {
  let { username, name, email, password } = req.body;

  if (
    typeof username !== 'string' ||
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return res.status(400).json({ error: 'Invalid format, strings required' });
  }

  username = username.toLowerCase();
  email = email.toLowerCase();

  if (!username || !name || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const result = await db.query(
      'INSERT INTO app_user (username, name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, name, email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      res.status(409).json({ error: err.constraint + ': ' + err.detail });
    } else if (err.code === '22001') {
      res.status(400).json({ error:  'One of the variables exceeds length limit.' })
    } else {
      console.error(err);
      res.status(500).json({ error: 'Unexpected error' });
    }
  }
});

router.get('/user', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM app_user');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/user/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM app_user WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.put('/user/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const { email } = req.body;
  try {
    const result = await db.query(
      'UPDATE app_user SET name = $1 WHERE id = $2 RETURNING *',
      [name, email, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/user/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM app_user WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted', user: result.rows[0] });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;