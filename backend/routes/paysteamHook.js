// backend/routes/paysteamHook.js
const express = require('express');
const pool    = require('../db');
const router  = express.Router();
const validateApiKey = require('../middleware/validateApiKey');




router.post('/notify', validateApiKey, async (req, res) => {
  const { idTransazione, esito } = req.body;

  if (!['OK', 'KO'].includes(esito)) {
    return res.status(400).json({ error: 'Esito non valido' });
  }

  const nuovoStato = esito === 'OK' ? 'PAGATO' : 'KO';

  try {
    await pool.query(
      `UPDATE BIGLIETTO SET STATO = $1 WHERE ID_BIGLIETTO = $2`,
      [nuovoStato, idTransazione]
    );

    res.status(200).json({ message: 'Stato aggiornato a ' + nuovoStato });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore aggiornamento stato biglietto' });
  }
});

module.exports = router;
