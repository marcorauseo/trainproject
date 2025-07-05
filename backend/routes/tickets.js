const express = require('express');
const router  = express.Router();   
const pool    = require('../db');
const auth    = require('../middleware/auth');  
// backend/routes/tickets.js
router.post('/buy', auth(['REG','BOA','BOE']), async (req,res)=>{
  const { tratta_id, posto='AUTO' } = req.body;
  const utente_id = req.user.id;

  /* 1. calcola prezzo / posto libero …  */
  /*    … stesso codice di prima (seat, prezzo) … */

  /* 2. crea biglietto STATO='IN_ATTESA_PAG' per ottenere l'id */
  const ins = await pool.query(
    `INSERT INTO BIGLIETTO
     (ID_UTENTE, ID_CORSA, NUM_POSTO, PREZZO, STATO)
     VALUES ($1,$2,$3,$4,'IN_ATTESA_PAG') RETURNING ID_BIGLIETTO`,
    [utente_id, tratta_id, seat, prezzo]
  );
  const idBiglietto = ins.rows[0].id_biglietto;

  /* 3. prepara l’URL PaySteam */
  const url = new URL(process.env.PAYSTEAM_URL);
  url.searchParams.set('merchant_url', 'http://localhost:3000');
  url.searchParams.set('callback_url',
        'http://localhost:3000/api/paysteam/notify');
  url.searchParams.set('id_esercente', process.env.MERCHANT_ID);
  url.searchParams.set('id_transazione', idBiglietto);
  url.searchParams.set('descrizione',
        `Biglietto tratta ${tratta_id}, posto ${seat}`);
  url.searchParams.set('prezzo', prezzo.toFixed(2));

  /* 4. restituisci redirect al client */
  res.json({ redirect: url.toString() });
});

module.exports = router;