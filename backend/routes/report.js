const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

/**  GET /api/report/occupancy  (BOA) */
router.get('/occupancy', auth(['BOA']), async (_, res, next) => {
  try {
    const r = await pool.query(`
      SELECT tratta_id, COUNT(*) AS posti_venduti
      FROM biglietto
      GROUP BY tratta_id
      ORDER BY tratta_id
    `);
    res.json(r.rows);
  } catch (err) { next(err); }
});

module.exports = router;
