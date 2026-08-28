const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");

const protect = async (req,res,next) => {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader?.startsWith('Bearer'))
            return next(new AppError('Not Logged in',401));

        const token = authHeader.split(' ')[1];
        let decoded;

        try{
            decoded = jwt.verify(token,process.env.JWT_SECRET);       
        }
        catch(err){
            const msg = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid Token';
            return next(new AppError('User no longer exist',401));
        }
        const freshUser = await User.findById(decoded.id);
        if(!freshUser) return next(new AppError('User no longer exist',401));

        req.user = freshUser;
        next();
    }
    catch(error){
        next(error);
    }
}

module.exports = protect;