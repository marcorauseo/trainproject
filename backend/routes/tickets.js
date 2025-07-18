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

/* --------- 0. acquisto biglietto --------- */

/* --------- 0. acquisto biglietto --------- */
router.post('/buy', auth(['REG']), async (req, res) => {
  console.log('Richiesta acquisto:', req.body);
  console.log('Utente:', req.user);
  const userId = req.user.id;
  const { tratta_id, posto } = req.body;

  if (!tratta_id)
    return res.status(400).json({ error: 'Tratta mancante' });

  try {
    let numeroPosto = null;

    if (posto === 'AUTO') {
      const treno = await pool.query(
        'SELECT ID_CONVOGLIO FROM TRENO WHERE ID_TRENO = $1',
        [tratta_id]
      );
      const idConvoglio = treno.rows[0]?.id_convoglio;

      const rotabili = await pool.query(
        `SELECT C.ID_MATERIALE_ROTABILE, T.SEDUTE
         FROM CONVOGLIO C
         JOIN MATERIALE_ROTABILE M ON M.ID_MATERIALE = C.ID_MATERIALE_ROTABILE
         JOIN TIPO_MATERIALE_ROTABILE T ON T.ID_TIPO = M.ID_TIPO_MATERIALE
         WHERE C.ID_CONVOGLIO = $1
         ORDER BY C.POSIZIONE_NEL_CONVOGLIO`, [idConvoglio]);

      const postiTotali = rotabili.rows.reduce((sum, r) => sum + r.sedute, 0);

      const occupati = await pool.query(
        'SELECT NUM_POSTO FROM BIGLIETTO WHERE ID_CORSA = $1 AND NUM_POSTO IS NOT NULL',
        [tratta_id]
      );
      const postiOccupati = occupati.rows.map(p => p.num_posto);

      for (let i = 1; i <= postiTotali; i++) {
        if (!postiOccupati.includes(i)) {
          numeroPosto = i;
          break;
        }
      }
    } else {
      numeroPosto = parseInt(posto);
    }

    const result = await pool.query(
      `INSERT INTO BIGLIETTO (
        ID_UTENTE, ID_CORSA, NUM_POSTO, PREZZO, STATO
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING ID_BIGLIETTO`,
      [
        userId,
        tratta_id,
        numeroPosto,
        15.00,
        'IN_ATTESA_PAG'
      ]
    );

    const idBiglietto = result.rows[0].id_biglietto;

    // chiamata a PaySteam
    const response = await fetch('http://localhost:4000/api/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': 'ferrovie-key' },
      body: JSON.stringify({
        url_invio: 'http://localhost:3000',
        url_risposta: 'http://localhost:3000/api/paysteam/callback',
        id_esercente: 'ferrovie-turistiche',
        id_transazione: idBiglietto,
        descrizione: `Biglietto treno ${tratta_id}`,
        prezzo: 15.00
      })
    });

    const payData = await response.json();
    if (!response.ok) throw new Error(payData.error || 'Errore da PaySteam');

    res.json({ message: 'Richiesta inviata a PaySteam', id: idBiglietto });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore acquisto o pagamento' });
  }
});
