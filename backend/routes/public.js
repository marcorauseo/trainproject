const express = require('express');
const pool = require('../db');
const router = express.Router();

/**  GET /api/public/line  */
router.get('/line', async (_, res, next) => {
  try {
    const r = await pool.query('SELECT * FROM stazione ORDER BY km ASC');
    res.json(r.rows);
  } catch (err) { next(err); }
});

/**  GET /api/public/timetable  */
router.get('/timetable', async (_, res, next) => {
  try {
    const r = await pool.query('SELECT * FROM vista_orari_pubblici ORDER BY orario_partenza');
    res.json(r.rows);
  } catch (err) { next(err); }
});

module.exports = router;
