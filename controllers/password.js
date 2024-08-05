const { createTransport } = require("nodemailer");
const uuidv4 = require("uuid").v4;
const path = require("path");
const bcrypt = require("bcrypt");

const ForgotPasswordRequests = require("../models/forgotPassword");
const User = require("../models/user");

exports.sendForgotPassword = async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.log("User not found:", req.body.email);
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a unique ID for the password reset request
    const forgetPasswordId = uuidv4();
    console.log("Generated forgetPasswordId:", forgetPasswordId);

    // Create the HTML content for the email
    const resetLink = `https://expense-tracker-livid-tau.vercel.app//password/forgotpassword/${forgetPasswordId}`;
    const htmlContent = `<a href="${resetLink}">Link to Reset Password</a>`;

    // Configure the transporter for sending emails
    const transporter = createTransport({
      host: process.env.BREVO_HOST,
      port: 587,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_SMTP_KEY,
      },
    });

    // Define the email options
    const mailOptions = {
      from: '"Ashish kumar" <ashishkumar@gmail.com>',
      to: req.body.email,
      subject: "Forgot Password",
      html: htmlContent,
    };

    // Create a new forgot password request entry in the database
    const forgetPassword = await ForgotPasswordRequests.create({
      forgetPasswordId: forgetPasswordId,
      userId: user._id,
    });
    console.log("Created forgotPassword entry:", forgetPassword);

    // Update the user's record with the new forgot password request
    await user.updateOne({
      $push: { forgetPasswordRequest: forgetPassword._id },
    });
    console.log("Updated user with new forgotPasswordRequest:", user._id);

    // Send the email with the reset link
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent to:", req.body.email);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Error in sendForgotPassword:", err);
    res
      .status(err.status === 404 ? 404 : 500)
      .json({ error: err.message || "Internal server error" });
  }
};

exports.getForgotPassword = async (req, res) => {
  try {
    // Find the forgot password request by ID
    const userRequest = await ForgotPasswordRequests.findOne({
      forgetPasswordId: req.params.uuid,
    });
    console.log("Retrieved userRequest:", userRequest);

    if (!userRequest) {
      return res.status(404).send("<h1>Password reset request not found</h1>");
    }

    if (!userRequest.isActive) {
      return res.status(400).send("<h1>Password reset request expired</h1>");
    }

    // Send the HTML file for the password reset page
    res.sendFile(path.join(__dirname, "../public/forgetPassword.html"));
  } catch (error) {
    console.error("Error in getForgotPassword:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.newPassword = async (req, res) => {
  try {
    console.log("Received request to update password:", req.body);

    // Find the forgot password request by ID
    const userRequest = await ForgotPasswordRequests.findOne({
      forgetPasswordId: req.params.uuid,
    });
    console.log("Retrieved userRequest for new password:", userRequest);

    if (!userRequest) {
      return res
        .status(404)
        .json({ error: "Password reset request not found" });
    }

    if (!userRequest.isActive) {
      return res.status(400).json({ error: "Password reset request expired" });
    }

    // Find the user associated with the request
    const user = await User.findById(userRequest.userId);
    console.log("Retrieved user for new password:", user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!req.body.password) {
      return res.status(400).json({ error: "New password is required" });
    }

    // Hash the new password
    const saltRounds = 10;
    const hash = await bcrypt.hash(req.body.password, saltRounds);
    console.log("Hashed new password:", hash);

    // Update the user's password
    user.password = hash;
    await user.save();
    console.log("User password updated successfully:", user._id);

    // Deactivate the password reset request
    userRequest.isActive = false;
    await userRequest.save();
    console.log("Deactivated forgotPasswordRequest:", userRequest._id);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in newPassword:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
