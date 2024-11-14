const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    profileImage:{type:String,default:''},
    github:{type:String,default:'https://github.com'},linkedin:{type:String,default:'https://linkedin.com'},
    twitter:{type:String,default:'https://twitter.com'},unsplash:{type:String,default:'https://unsplash.com'}
})

const User = mongoose.model('User', UserSchema);

module.exports = User;