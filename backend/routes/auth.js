const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { body, validationResult } = require('express-validator');


// Registrazione
router.post(
  '/register',

  /* ① Validazione campi ------------------------------------------------ */
  body('nome').notEmpty().withMessage('Il nome è obbligatorio'),
  body('cognome').notEmpty().withMessage('Il cognome è obbligatorio'),
  body('email').isEmail().withMessage('Email non valida'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password troppo corta (min 8 caratteri)'),

 
  async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      nome,
      cognome,
      email,
      password,
      cellulare = null,
      data_nascita = null,
      luogo_nascita = null
    } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await pool.query(
        `INSERT INTO UTENTE
         (NOME, COGNOME, EMAIL, HASH_PWD, CELLULARE,
          DATA_NASCITA, LUOGO_NASCITA, RUOLO)
         VALUES ($1,$2,$3,$4,$5,$6,$7,'REG')
         RETURNING ID_UTENTE`,
        [nome, cognome, email, hashedPassword,
         cellulare, data_nascita, luogo_nascita]
      );

      res.status(201).json({
        message: 'Utente registrato con successo',
        id: result.rows[0].id_utente
      });
    } catch (err) {
      /* 23505 = violazione unique (email già usata) */
      if (err.code === '23505') {                           // :contentReference[oaicite:4]{index=4}
        return res
          .status(409)
          .json({ error: 'Email già registrata' });
      }

      console.error(err);                                   // log interno
      res.status(500).json({ error: 'Errore interno' });
    }
  }
);



/* ------------------------------ LOGIN ------------------------------ */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const r = await pool.query('SELECT * FROM UTENTE WHERE EMAIL=$1', [email]);
    if (r.rows.length === 0) {
      return res.status(400).json({ error: 'Utente non trovato' });
    }
    const user = r.rows[0];
    const valid = await bcrypt.compare(password, user.hash_pwd);
    if (!valid) {
      return res.status(400).json({ error: 'Password errata' });
    }
    const token = jwt.sign(
      { id: user.id_utente, ruolo: user.ruolo, nome: user.nome },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ message: 'Login OK', token, nome: user.nome });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore durante il login' });
  }
});

module.exports = router;


