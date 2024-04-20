const jwt = require("jsonwebtoken");
const User = require("../models/user");
require('dotenv').config(); 

const authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        console.log("User token:", token);
        if (!token) {
            return res.status(401).json({ message: "Authorization token is missing" });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
            const user = await User.findByPk(decoded.userId);
            if (!user) {
                return res.status(401).json({ message: "Invalid token" });
            }
            req.user = user; // IMPORTANT
            next();
        } catch (error) {
            return res.status(401).json({ message: "Invalid token", error: error.message });
        }
    } catch (error) {
        return res.status(500).json({ message: "Authentication failed", error: error.message });
    }
}

module.exports = authenticate;
