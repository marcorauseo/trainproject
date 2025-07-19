const express = require('express');
const pool = require('../db');
const router = express.Router();

// GET tutte le corse (semplificato)
router.get('/corse', async (req, res) => {
  try {
    const r = await pool.query(`
      SELECT T.ID_TRENO, T.DATA, T.CODICE_CORSA,
             S1.NOME AS partenza, S2.NOME AS arrivo
      FROM TRENO T
      JOIN STAZIONE S1 ON S1.ID_STAZIONE = T.ID_STAZIONE_PARTENZA
      JOIN STAZIONE S2 ON S2.ID_STAZIONE = T.ID_STAZIONE_ARRIVO
      ORDER BY T.DATA DESC`);
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore lettura corse' });
  }
});

// POST nuova corsa
router.post('/corsa', async (req, res) => {
  const { data, codice, partenza, arrivo, convoglio } = req.body;
  if (!data || !codice || !partenza || !arrivo || !convoglio)
    return res.status(400).json({ error: 'Dati mancanti' });

  try {
    await pool.query(
      `INSERT INTO TRENO (DATA, CODICE_CORSA, ID_STAZIONE_PARTENZA, ID_STAZIONE_ARRIVO, ID_CONVOGLIO)
       VALUES ($1, $2, $3, $4, $5)`,
      [data, codice, partenza, arrivo, convoglio]
    );
    res.status(201).json({ message: 'Corsa creata' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore creazione corsa' });
  }
});

// DELETE corsa
router.delete('/corsa/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM TRENO WHERE ID_TRENO = $1', [id]);
    res.json({ message: 'Corsa eliminata' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore eliminazione' });
  }
});

module.exports = router;
