const mongoose = require('mongoose');

let confirmation = new mongoose.Schema({
    username : {
        type : String,
        required : [true,'give a user name'],
        trim : true , 
        unique : true , 
        maxLength : [20,'username should be within 20 characters'],
    },
    email : {
        type : String,
        required : [true,'give an email'],
        trim : true , 
        unique : true , 
        maxLength : [50,'username should be within 50 characters'],
    },
    password : {
        type : String,
        require : true ,
    },
    confirmation : {
        type : String,
        require : true ,
    }
});

module.exports = mongoose.model('confirmation',confirmation);