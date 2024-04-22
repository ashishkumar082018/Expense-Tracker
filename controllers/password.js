const { createTransport } = require('nodemailer');
const uuidv4 = require('uuid').v4;
const path = require('path');
const bcrypt = require('bcrypt');

const ForgotPasswordRequests = require('../models/forgotPassword');
const User = require('../models/user');
const sequelize = require('../util/database');

const transporter = createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: 'ashishkumar082018@gmail.com',
        pass: process.env.BREVO_SMTP_KEY
    }
});

exports.sendForgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) {
            throw new Error("User not found");
        }
        const id = uuidv4();
        const htmlContent = `<a href="http://localhost:3000/password/forgotpassword/${id}"">Link to Reset Password</a>`;
        
        // Send email asynchronously
        await transporter.sendMail({
            from: '"Ashish kumar" <ashishkumar082018@gmail.com>',
            to: req.body.email,
            subject: 'Forgot Password',
            html: htmlContent
        });

        // Create forgot password request
        await ForgotPasswordRequests.create({ id: id, userId: user.id });
        
        res.status(200).json({ message: "Email sent successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to send email" });
    }
};

exports.getForgotPassword = async (req, res) => {
    try {
        const userRequest = await ForgotPasswordRequests.findOne({ where: { id: req.params.uuid } });
        if (!userRequest) {
            return res.status(404).send("<h1>Password reset request not found</h1>");
        }
        if (!userRequest.isActive) {
            return res.status(400).send("<h1>Password reset request expired</h1>");
        }
        res.sendFile(path.join(__dirname, '..', 'public', 'forgetPassword.html'));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.newPassword = async (req, res) => {
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
        if (userRequest.isActive) {
            user.password = hash;
            await user.save();
            userRequest.isActive = false;
            await userRequest.save();
        }
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
