let mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

let userSchema = new mongoose.Schema({
    username:  { type: String, required: true, unique: true },
    email:  { type: String, required: true },
    password:  { type: String},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    firstname: String,
    lastname: String,
    dob: Date,
    gender: String,
    about: String,
    profilephoto: String,
    coverphoto: String,
    isAdmin: Boolean,
    isModerator: Boolean 
});

userSchema.plugin(passportLocalMongoose);

let User =  mongoose.model('User',userSchema);

module.exports = User;