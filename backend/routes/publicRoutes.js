const express = require('express');
const pool = require('../db');
const router = express.Router();

// GET /api/public/stazioni
router.get('/stazioni', async (req, res) => {
  try {
    const r = await pool.query('SELECT ID_STAZIONE, NOME FROM STAZIONE ORDER BY NOME');
    const out = r.rows.map(s => ({ id_stazione: s.id_stazione, nome: s.nome }));
    res.json(out);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore caricamento stazioni' });
  }
});

// GET /api/public/convogli
router.get('/convogli', async (req, res) => {
  try {
    const r = await pool.query('SELECT ID_CONVOGLIO, NOME_CONVOGLIO FROM CONVOGLIO ORDER BY NOME_CONVOGLIO');
    const out = r.rows.map(c => ({ id_convoglio: c.id_convoglio, nome_convoglio: c.nome_convoglio }));
    res.json(out);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore caricamento convogli' });
  }
});

module.exports = router;
