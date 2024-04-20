const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();

const sequelize = require("./util/database");
const expenseRoute = require("./routes/expense");
const userRoute = require("./routes/user");
const User = require('./models/user');
const Expense = require('./models/expense');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use("/expense", expenseRoute);
app.use("/user", userRoute);

User.hasMany(Expense);
Expense.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => console.log(err));
