const express = require('express');
const router = express.Router();
const db = require('../../db');


router.post('/rentable', async (req, res) => {
  const { name } = req.body;
  const { description } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO rentable (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    //console.error(err);
    res.status(500).json({ error: 'Failed to create rentable'});
  }
});

module.exports = router;