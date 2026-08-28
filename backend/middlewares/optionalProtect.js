const jwt = require("jsonwebtoken");
const User = require("../models/User");

const optionalProtect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return next(); // Proceed as Guest
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const freshUser = await User.findById(decoded.id);
        
        if (freshUser) {
            req.user = freshUser; // Proceed as Logged In
        }
        next();
    } catch (error) {
        // If token is expired or invalid, just fall back to guest
        next();
    }
}

module.exports = optionalProtect;
