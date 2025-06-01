const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/routes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tratta');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/buy', async (req, res) => {
  const { utente_id, tratta_id, posto } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO biglietto (utente_id, tratta_id, data_acquisto, posto) VALUES ($1, $2, NOW(), $3) RETURNING *',
      [utente_id, tratta_id, posto]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;