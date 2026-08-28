const User = require("../models/User");
const AppError = require("../utils/AppError");

const register = async(req,res,next) => {
    try{
        const {name,email,password } = req.body;


        if(!name || !email || !password)
            return next(new AppError('Please provide all fields',400));

        if(password.length < 8)
            return next(new AppError('Password must be 8+ characters',400));

        const exisiting = await User.findOne({email});
        if(exisiting) return next(new AppError('Email already Exist',409));

        const user = await User.create({name,email,password});
        const token = user.generateToken();

        res.status(200).json({
            success : true, token,
            user : {id : user._id,name : user.name,email :user.email,role:user.role}
        });
        
    }
    catch(error){
        next(error)
    }
}

const login = async(req, res, next) => {
    try{
        const {email,password} = req.body;

        if(!email || !password) 
            return next(new AppError('Invalid  Email or Password',401));

        const user = await User.findOne({email}).select('+password +failedLoginAttempt');
        if(!user)  return next(new AppError('Invalid Email or password',401));

        if(user.lockUntil && user.lockUntil > Date.now()){
            const mins = Math.ceil(user.lockUntil - Date.now()) / 60000;
            return next(new AppError(`Account locked. Try in ${mins} minutes.`, 423));
        }

        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            user.failedLoginAttempts += 1;
            if(user.failedLoginAttempts >=5) user.lockUntil = Date.now() + 30*60*1000;
            await user.save({validateBeforeSave : false});
            return next(new AppError('Invalid Email or Passowrd',401));
        }

        user.failedLoginAttempts = 0;
        user.lockUntil = undefined;
        user.lastLoginAt = new Date();
        await user.save({validateBeforeSave : false});

        const token = user.generateToken();

        res.json({
            success : true,token,
            user : {id : user._id,name : user.name,email :user.email,role:user.role}            
        })
    }
    catch(error){
        next(error)
    }
}
module.exports = {
    register,
    login
}