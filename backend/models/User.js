const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase: true
    },
    password : {
        type : String,
        required : true,
        minLength : 8,
        select : false
    },
    role : {
        type : String,
        enum : ['user','admin'],
        default : 'user'
    },
    passwordChangedAt : Date,
    failedLoginAttempts : {
        type : Number,
        default : 0
    },
    lockUntil : Date
}, {
    timestamps: true
});

//Auto-hash Password before save
userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();

    this.password =  await bcrypt.hash(this.password,12);
    if(!this.isNew) this.passwordChangedAt = new Date(Date.now() - 1000);
    next();
});

//helper methods
userSchema.methods.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate,this.password);
}

userSchema.methods.generateToken = function(){
    return jwt.sign({
        id : this._id,
        role : this.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn : process.env.JWT_EXPIRES
    }   
)}





module.exports = mongoose.model('User',userSchema);