
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Treni pubblici esistenti da vista_orari_pubblici
router.get('/boe/pubblici', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vista_orari_pubblici ORDER BY orario_partenza');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nella query vista_orari_pubblici' });
  }
});

// Richieste da BOA
router.get('/boe/richieste', async (req, res) => {
  const r = await pool.query("SELECT * FROM richiesta_boa WHERE stato = 'in_attesa'");
  res.json(r.rows);
});

router.post('/boe/richieste/:id/completa', async (req, res) => {
  await pool.query("UPDATE richiesta_boa SET stato = 'completata' WHERE id = $1", [req.params.id]);
  res.sendStatus(200);
});

// Elenco treni
router.get('/boe/treni', async (req, res) => {
  const r = await pool.query("SELECT id_treno, codice_corsa, data FROM treno ORDER BY data DESC");
  res.json(r.rows);
});

// Crea nuovo treno
router.post('/boe/treni', async (req, res) => {
 const { data, codice, direzione, convoglio, partenza, arrivo, orap } = req.body;
  try {
    // 1. Controllo conflitto di orario
    const conflitto = await pool.query(`
      SELECT 1
      FROM traccia_oraria TR JOIN treno T ON T.id_treno = TR.id_corsa
      WHERE TR.id_stazione = $1 AND TR.orario_partenza = $2::TIME AND T.direzione_corsa = $3
    `, [partenza, orap, direzione]);

    if (conflitto.rows.length > 0) {
      return res.status(400).json({ error: 'Esiste già un treno in partenza da questa stazione, in quella direzione e orario.' });
    }

    // 2. Calcolo distanza e durata
    const distRes = await pool.query(`
      SELECT ABS(S1.km - S2.km) AS distanza
      FROM stazione S1, stazione S2
      WHERE S1.id_stazione = $1 AND S2.id_stazione = $2
    `, [partenza, arrivo]);

    const distanza = distRes.rows[0].distanza;
    const durataMinuti = Math.ceil((distanza / 50) * 60);

    // Calcolo orario di arrivo
    const [h, m] = orap.split(':').map(Number);
    const arrHour = h + Math.floor((m + durataMinuti) / 60);
    const arrMin = (m + durataMinuti) % 60;
    const oraa = `${arrHour.toString().padStart(2, '0')}:${arrMin.toString().padStart(2, '0')}`;

    // 3. Inserimento treno
    const result = await pool.query(
      `INSERT INTO treno (data, codice_corsa, direzione_corsa, id_convoglio, id_stazione_partenza, id_stazione_arrivo)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_treno`,
      [data, codice, direzione, convoglio, partenza, arrivo]
    );
    const idTreno = result.rows[0].id_treno;

    // 4. Traccia oraria
    await pool.query(
      `INSERT INTO traccia_oraria (id_stazione, id_corsa, orario_partenza, km_cumulati, velocita)
       VALUES ($1, $2, $3::TIME, 0, 50)`,
      [partenza, idTreno, orap]
    );
    await pool.query(
      `INSERT INTO traccia_oraria (id_stazione, id_corsa, orario_arrivo, km_cumulati, velocita)
       VALUES ($1, $2, $3::TIME, $4, 50)`,
      [arrivo, idTreno, oraa, distanza]
    );

    res.status(201).json({ message: 'Treno creato con successo', orario_arrivo: oraa });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore creazione treno' });
  }
});

// Elimina treno se non ha biglietti
router.delete('/treni/:id', async (req, res) => {
  const id = req.params.id;
  try {
    // Controlla se ci sono biglietti
    const check = await pool.query("SELECT COUNT(*) FROM biglietto WHERE id_corsa = $1", [id]);
    const count = parseInt(check.rows[0].count);
    if (count > 0) {
      return res.status(400).json({ error: 'Non puoi eliminare un treno con biglietti già acquistati.' });
    }

    // Elimina prima tracce orarie
    await pool.query("DELETE FROM traccia_oraria WHERE id_corsa = $1", [id]);
    // Poi il treno
    await pool.query("DELETE FROM treno WHERE id_treno = $1", [id]);

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore durante eliminazione treno' });
  }
});

module.exports = router;
