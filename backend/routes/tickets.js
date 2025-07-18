/* già in testa */
const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const auth    = require('../middleware/auth');

/* … POST /buy già presente … */

/* --------- 1. lista biglietti dell’utente --------- */
router.get('/mine', auth(['REG','BOA','BOE']), async (req, res) => {
  try {
    const r = await pool.query(`
      SELECT B.ID_BIGLIETTO, B.STATO, B.PREZZO, B.NUM_POSTO,
             T.CODICE_CORSA, T.DATA,
             S1.NOME AS PARTENZA, S2.NOME AS ARRIVO
      FROM   BIGLIETTO B
      JOIN   TRENO T  ON T.ID_TRENO = B.ID_CORSA
      JOIN   STAZIONE S1 ON S1.ID_STAZIONE = T.ID_STAZIONE_PARTENZA
      JOIN   STAZIONE S2 ON S2.ID_STAZIONE = T.ID_STAZIONE_ARRIVO
      WHERE  B.ID_UTENTE = $1
      ORDER BY T.DATA DESC
    `, [req.user.id]);

    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore lettura biglietti' });
  }
});

/* --------- 2. annulla biglietto (se ancora non partito) --------- */
router.patch('/:id/cancel', auth(['REG','BOA','BOE']), async (req,res)=>{
  const id = req.params.id;
  try {
    const upd = await pool.query(
      `UPDATE BIGLIETTO
       SET STATO = 'ANNULLATO'
       WHERE ID_BIGLIETTO=$1
         AND ID_UTENTE=$2
         AND STATO IN ('IN_ATTESA_PAG','PAGATO')
       RETURNING *`,
      [id, req.user.id]
    );
    if (upd.rowCount === 0)
      return res.status(409).json({ error:'Impossibile annullare' });

    res.json({ message:'Biglietto annullato', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error:'Errore annullo' });
  }
});

module.exports = router;   /* unica export */
