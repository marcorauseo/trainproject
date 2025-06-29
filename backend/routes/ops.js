const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

/** BOE: inserisce un nuovo convoglio */
router.post('/convoy', auth(['BOE']), async (req,res,next)=>{
  const { nome, tipo } = req.body;
  try {
    const r = await pool.query('INSERT INTO treno (nome,tipo) VALUES ($1,$2) RETURNING *',[nome,tipo]);
    res.status(201).json(r.rows[0]);
  } catch(err){ next(err);}
});

/** BOE: crea o modifica una corsa */
router.put('/runs/:id', auth(['BOE']), async (req,res,next)=>{
  const { id } = req.params;
  const { orario_partenza, orario_arrivo } = req.body;
  try{
    const r = await pool.query(
      'UPDATE tratta SET orario_partenza=$1, orario_arrivo=$2 WHERE id=$3 RETURNING *',
      [orario_partenza, orario_arrivo, id]
    );
    res.json(r.rows[0]);
  }catch(err){next(err);}
});

module.exports = router;
