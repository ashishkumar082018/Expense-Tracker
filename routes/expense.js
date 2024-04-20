const express = require('express');
const router = express.Router();
const userAuthentaction  = require('../middleware/auth');

const expenseController = require('../controllers/expense');

router.post('/add-expense',userAuthentaction, expenseController.addExpense);
router.get('/get-expense',userAuthentaction, expenseController.getExpense);
router.delete('/delete-expense/:id',userAuthentaction, expenseController.deleteExpense);

module.exports = router;