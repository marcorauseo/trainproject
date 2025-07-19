const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { body, validationResult } = require('express-validator');


// Registrazione
router.post('/register', async (req, res) => {

  const { nome, cognome, email, password } = req.body;

  if (!nome || !cognome || !email || !password)
    return res.status(400).json({ error: 'Campi obbligatori mancanti' });

  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(`
      INSERT INTO utente (NOME, COGNOME, EMAIL, HASH_PWD, RUOLO)
      VALUES ($1, $2, $3, $4, 'REG')
      RETURNING ID_UTENTE
    `, [nome, cognome, email, hash]);

    res.status(201).json({ message: 'Registrazione completata', id: result.rows[0].id_utente });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      res.status(409).json({ error: 'Email già registrata' });
    } else {
      res.status(500).json({ error: 'Errore server durante la registrazione' });
    }
  }
});



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
      { id: user.id_utente, ruolo: user.ruolo, nome: user.nome, email: user.email  },
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


