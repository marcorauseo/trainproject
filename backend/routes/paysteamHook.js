// backend/routes/paysteamHook.js
const express = require('express');
const pool    = require('../db');
const router  = express.Router();

router.post('/notify', async (req, res) => {
  const { idTransazione, esito } = req.body;          // OK | KO
  try {
    await pool.query(
      'UPDATE BIGLIETTO SET STATO=$1 WHERE ID_BIGLIETTO=$2',
      [esito === 'OK' ? 'PAGATO' : 'KO', idTransazione]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err); res.sendStatus(500);
  }
});

module.exports = router;
