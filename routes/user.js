const express = require('express');
const router = express.Router();

const expenseController = require('../controllers/user');

router.post('/signup', expenseController.signUp);

module.exports = router;