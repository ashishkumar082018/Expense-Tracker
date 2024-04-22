const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();

const passwordRoute = require("./routes/password");
const sequelize = require("./util/database");
const expenseRoute = require("./routes/expense");
const userRoute = require("./routes/user");
const purchaseRoute = require("./routes/purchase");
const premiumRoute = require("./routes/premium");

const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require("./models/order");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use("/expense", expenseRoute);
app.use("/user", userRoute);
app.use('/purchase', purchaseRoute);
app.use('/premium', premiumRoute);
app.use('/password', passwordRoute);

User.hasMany(Expense);
Expense.belongsTo(User);

Order.belongsTo(User);
User.hasMany(Order);

sequelize
  .sync(
  //  {force : true}
  )
  .then(() => {
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => console.log(err));
