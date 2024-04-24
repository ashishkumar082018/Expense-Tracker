const { createTransport } = require('nodemailer');
const uuidv4 = require('uuid').v4;
const path = require('path');
const bcrypt = require('bcrypt');
const ForgotPasswordRequests = require('../models/forgotPassword');
const User = require('../models/user');
const sequelize = require('../util/database');
exports.sendForgotPassword = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }
        const id = uuidv4();
        const htmlContent = `<a href="http://localhost:3000/password/forgotpassword/${id}">Link to Reset Password</a>`;
        const transporter = createTransport({
            host: process.env.BREVO_HOST,
            port: process.env.PORT,
            auth: {
                user: process.env.BREVO_USER,
                pass: process.env.BREVO_SMTP_KEY
            }
        });
        const mailOptions = {
            from: '"Ashishkumar" <ashishkumar082018@gmail.com>',
            to: req.body.email,
            subject: 'Forgot Password',
            text: htmlContent
        };
        await ForgotPasswordRequests.create({ id: id, userId: user.id }, { transaction: t });
        await t.commit();
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent sucessfully" });
    }
    catch (err) {
        if (err.status === 404) {
            res.status(404).json({ error: err.message });
        }
        else {
            console.log(err);
            await t.rollback();
            res.status(500).json({ error: "Internal server error" });
        }
    }
}
exports.getForgotPassword = async (req, res) => {
    try {
        const userRequest = await ForgotPasswordRequests.findOne({ where: { id: req.params.uuid } });
        if (!userRequest) {
            res.send("<h1>Password reset request not found</h1>");
        }
        if (!userRequest.isActive) {
            res.send("<h1>Password reset request expired</h1>");
        }
        else {
            res.sendFile(path.join(__dirname, '../views/forgetPassword.html'));
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
exports.newPassword = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const userRequest = await ForgotPasswordRequests.findOne({ where: { id: req.params.uuid } });
        if (!userRequest) {
            throw new Error("Password reset request not found");
        }
        const user = await User.findOne({ where: { id: userRequest.userId } });
        if (!user) {
            throw new Error("User not found");
        }
        const saltRounds = 10;
        const hash = await bcrypt.hash(req.body.password, saltRounds);
        if (userRequest.isActive == true) {
            user.password = hash;
            await user.save({ transaction: t });
            userRequest.isActive = false;
            await userRequest.save({ transaction: t });
            await t.commit();
        }
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        await t.rollback();
        res.status(500).json({ error: "Internal Server Error" });
    }
}