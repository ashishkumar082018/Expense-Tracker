const sequelize = require('../util/database');
const User = require('../models/user');
const Expense = require('../models/expense');

exports.getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.findAll({
            attributes: ['name', 'totalexpense'],
            order: [['totalexpense', 'DESC']]
        });
        res.status(200).json(leaderboard);
    } catch (err) {
        console.error('Error fetching leaderboard:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};