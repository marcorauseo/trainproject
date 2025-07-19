// backend/routes/report.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET /api/report/occupazione?dal=YYYY-MM-DD&al=YYYY-MM-DD
router.get('/occupazione', auth(['BOA']), async (req, res) => {
  const { dal, al } = req.query;

  if (!dal || !al) {
    return res.status(400).json({ error: 'Date mancanti' });
  }

  try {
    const result = await pool.query(`
      SELECT
        T.ID_TRENO,
        T.CODICE_CORSA,
        T.DATA,
        S1.NOME AS PARTENZA,
        S2.NOME AS ARRIVO,
        COUNT(B.ID_BIGLIETTO) FILTER (WHERE B.STATO = 'PAGATO') AS POSTI_OCCUPATI,
        SUM(TMR.SEDUTE) AS POSTI_TOTALI,
        ROUND(COUNT(B.ID_BIGLIETTO) FILTER (WHERE B.STATO = 'PAGATO') * 100.0 / NULLIF(SUM(TMR.SEDUTE), 0), 2) AS PERCENTUALE
      FROM TRENO T
      JOIN STAZIONE S1 ON S1.ID_STAZIONE = T.ID_STAZIONE_PARTENZA
      JOIN STAZIONE S2 ON S2.ID_STAZIONE = T.ID_STAZIONE_ARRIVO
      JOIN CONVOGLIO C ON C.ID_CONVOGLIO = T.ID_CONVOGLIO
      JOIN MATERIALE_ROTABILE MR ON MR.ID_MATERIALE = C.ID_MATERIALE_ROTABILE
      JOIN TIPO_MATERIALE_ROTABILE TMR ON TMR.ID_TIPO = MR.ID_TIPO_MATERIALE
      LEFT JOIN BIGLIETTO B ON B.ID_CORSA = T.ID_TRENO
      WHERE T.DATA BETWEEN $1 AND $2
      GROUP BY T.ID_TRENO, T.CODICE_CORSA, T.DATA, S1.NOME, S2.NOME
      ORDER BY T.DATA ASC;
    `, [dal, al]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nel report' });
  }
});

module.exports = router;
