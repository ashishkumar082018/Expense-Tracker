const { createTransport } = require('nodemailer');

exports.forgotPassword = async (req, res) => {
    try {
        const transporter = createTransport({
            host: 'smtp-relay.brevo.com',
            port: 587,
            auth: {
                user: 'ashishkumar082018@gmail.com',
                pass: process.env.BREVO_SMTP_KEY
            },
            //timeout (in milliseconds) to handle slow responses
            timeout: 10 
        });

        const mailOptions = {
            from: '"Ashish Kumar" <ashishkumar082018@gmail.com>',
            to: req.body.email,
            subject: 'Forgot Password',
            text: 'This mail has been set to reset your password'
        };
        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(200).json("Email sent successfully");
    } catch (err) {
        console.error(err);
        res.status(500).json(err.message || "Something went wrong while sending the email");
    }
}
