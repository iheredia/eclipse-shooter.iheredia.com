const { Database } = process.env.DETA_EMULATED ? require('./mock-detalib') : require('detalib');
const express = require('express');

const db = new Database('scores');
const router = express.Router();

const getHighScores = async () => {
  const scores = await db.all();
  return scores.sort((a, b) => b.data - a.data).slice(0, 10);
}

router.post('/score', async (req, res) => {
  const { name, score } = req.query;
  await db.put(name, parseInt(score));
  const highScores = await getHighScores();
  res.json(highScores);
});

router.get('/high_scores', async (req, res) => {
  const highScores = await getHighScores();
  res.json(highScores);
});

module.exports = router;
