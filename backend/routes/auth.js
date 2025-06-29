const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// Registrazione
router.post('/register', async (req, res) => {
  const { nome, cognome, email, password, cellulare, data_nascita, luogo_nascita, ruolo } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO utente (nome, cognome, email, hash_pwd, cellulare, data_nascita, luogo_nascita, ruolo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_utente',
      [nome, cognome, email, hashedPassword, cellulare, data_nascita, luogo_nascita, 'REG']
    );
    res.status(201).json({ message: 'Utente registrato con successo', id: result.rows[0].id_utente });
  } catch (err) {
    res.status(500).json({ error: 'Errore durante la registrazione' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM utente WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Utente non trovato' });
    }
    const user = result.rows[0];
        // Log delle credenziali
        console.log('Password inserita:', password);
        console.log('Hash memorizzato:', user.hash_pwd);
    const validPassword = await bcrypt.compare(password, user.hash_pwd);
    console.log('Risultato del confronto:', validPassword);
    if (!validPassword) {
      return res.status(400).json({ error: 'Password errata' });
    }
    console.log('login OK');
    //const token = jwt.sign({ id: user.id_utente, ruolo: user.ruolo }, process.env.JWT_SECRET, { expiresIn: '1h' });
    //res.json({ message: 'Login effettuato con successo', token });
    //res.json({ message: 'Login effettuato con successo', token });
  } catch (err) {
    res.status(500).json({ error: 'Errore durante il login' });
  }
  console.log('fuori dal try OK');
});

module.exports = router;
