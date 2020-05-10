const { Database } = process.env.DETA_EMULATED ? require('./mock-detalib') : require('detalib');
const express = require('express');

const db = new Database('scores');
const router = express.Router();

const getHighScores = async () => {
  const scores = await db.all();
  return scores.sort((a, b) => b.data - a.data).slice(0, 10);
}

router.post('/score', async (req, res) => {
  let existingScore;
  const { name, score } = req.query;
  const parsedScore = parseInt(score);
  try {
    existingScore = await db.get(name)
  } catch (e) {
    console.log(e)
  }
  if (existingScore && existingScore < parsedScore) {
    await db.put(name, parsedScore);
  }
  const highScores = await getHighScores();
  res.json(highScores);
});

router.get('/high_scores', async (req, res) => {
  const highScores = await getHighScores();
  res.json(highScores);
});

module.exports = router;
