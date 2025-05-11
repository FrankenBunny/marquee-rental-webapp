const express = require('express');
const router = express.Router();
const db = require('../db');

/**  
 *  USER CRUD
 *
 *  CREATE TABLE marquee_user (
 *    id SERIAL PRIMARY KEY,
 *    username VARCHAR(50) UNIQUE
 *  );
*/
router.post('/user', async (req, res) => {
  const { username } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO marquee_user (username) VALUES ($1) RETURNING *',
      [username]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user'});
  }
});

router.get('/user', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM marquee_user');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users'});
  }
});

router.get('/user/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM marquee_user WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users'});
  }
});

router.put('/user/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await db.query(
      'UPDATE marquee_user SET name = $1 WHERE id = $2 RETURNING *',
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
    const result = await db.query('DELETE FROM marquee_user WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted',  user: result.rows[0] });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;