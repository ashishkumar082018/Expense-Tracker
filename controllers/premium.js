const sequelize = require('../util/database');
const User = require('../models/user');
const Expense = require('../models/expense');

exports.getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.findAll({
            attributes: ['name', [sequelize.fn('sum', sequelize.col('expenses.amount')), 'Total_Expenses']],
            include: [{ model: Expense, attributes: [] }],
            group: ['user.id'],
            order: [['Total_Expenses', 'DESC']]
        });
        res.status(200).json(leaderboard);
    } catch (err) {
        console.error('Error fetching leaderboard:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};