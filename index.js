const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const compression = require("compression");
const morgan = require("morgan");

const expenseRoute = require("./routes/expense");
const userRoute = require("./routes/user");
const purchaseRoute = require("./routes/purchase");
const premiumRoute = require("./routes/premium");
const passwordRoute = require("./routes/password");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
dotenv.config();
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());

app.use("/", userRoute);
app.use('/expense', expenseRoute);
app.use('/user', userRoute);
app.use('/purchase', purchaseRoute);
app.use('/premium', premiumRoute);
app.use('/password', passwordRoute);

// app.use((req, res, next) => {
//     res.status(200).sendFile(path.join(__dirname, `public/${req.url}`));
// });

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log("Server running on port 3000");
        })
    })
    .catch(err => console.error(err))