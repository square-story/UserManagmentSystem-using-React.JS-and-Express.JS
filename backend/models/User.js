const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    profileImage:{type:String,default:''},
    github:{type:String,default:''},linkedin:{type:String,default:''},
    twitter:{type:String,default:''},unsplash:{type:String,default:''}
})

const User = mongoose.model('User', UserSchema);

module.exports = User;