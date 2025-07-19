
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get percentuale occupazione treni
router.get('/boa/occupazione', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        t.id_treno,
        COUNT(b.id_biglietto)::FLOAT / NULLIF(SUM(tmr.sedute), 0) * 100 AS percentuale
      FROM treno t
      JOIN convoglio c ON c.id_convoGLIO = t.id_convoGLIO
      JOIN materiale_rotabile mr ON mr.id_materiale = c.id_materiale_rotabile
      JOIN tipo_materiale_rotabile tmr ON tmr.id_tipo = mr.id_tipo_materiale
      LEFT JOIN biglietto b ON b.id_corsa = t.id_treno
      GROUP BY t.id_treno
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nella query occupazione' });
  }
});

// Richiesta treno straordinario
router.post('/boa/straordinario', async (req, res) => {
  console.log("Body ricevuto (straordinario):", req.body);
  const { id_treno } = req.body || {};
  if (!id_treno) return res.status(400).json({ error: "Campo 'id_treno' mancante" });

  try {
    await pool.query(
      "INSERT INTO richiesta_boa (id_treno, tipo) VALUES ($1, 'straordinario')",
      [id_treno]
    );
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore richiesta straordinario' });
  }
});

// Richiesta cessazione treno
router.post('/boa/cessazione', async (req, res) => {
  console.log("Body ricevuto (cessazione):", req.body);
  const { id_treno } = req.body || {};
  if (!id_treno) return res.status(400).json({ error: "Campo 'id_treno' mancante" });

  try {
    await pool.query(
      "INSERT INTO richiesta_boa (id_treno, tipo) VALUES ($1, 'cessazione')",
      [id_treno]
    );
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore richiesta cessazione' });
  }
});

// Elenco richieste per BOE
router.get('/boe/richieste', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM richiesta_boa WHERE stato = 'in_attesa'"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore caricamento richieste BOE' });
  }
});

// Completa una richiesta (BOE)
router.post('/boe/richieste/:id/completa', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query("UPDATE richiesta_boa SET stato = 'completata' WHERE id = $1", [id]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nel completamento richiesta' });
  }
});

// Ricerca treno per BOE (non ancora usato)
router.get('/boe/treni', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM treno WHERE id IN (SELECT id_treno FROM richiesta_boa WHERE tipo = 'treno')"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore caricamento treno BOE' });
  }
});

module.exports = router;
