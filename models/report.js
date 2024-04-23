const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const Report = sequelize.define('report', {
        url: {
        type: Sequelize.STRING,
        allowNull: false
    }
})
module.exports = Report;