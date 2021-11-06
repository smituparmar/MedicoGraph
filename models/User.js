const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    first_name:{
        type: String,
        required: true,
    },
    last_name:{
        type: String,
        required: true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    type: {
        type: String,
        default: "patient"
    },
    avatar:{
        type:String,
    },
    address: {
        type: Object,
        default: { city: null, state: null, street: null, zip: null }
      },
    phone: {
        type: String
    },
    created_at:{
        type:Date,
        default:Date.now,
    },
    dateOfBirth:{
        type:Date
    },
    newUser:{
        type:Boolean,
        default:true,
    }
});

module.exports = User = mongoose.model('user',UserSchema);