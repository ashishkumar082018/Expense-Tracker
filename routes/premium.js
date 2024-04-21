const express = require('express');

const authenticate = require('../middleware/auth');
const premiumController = require('../controllers/premium');

const router = express.Router();

router.get("/leaderboard", authenticate, premiumController.getLeaderboard);

module.exports = router;