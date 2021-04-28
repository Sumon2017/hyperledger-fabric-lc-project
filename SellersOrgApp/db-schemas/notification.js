const path = require('path');
const mongoose = require('mongoose');
//const subnot = require(path.join(__dirname,'sub-notification'));

let subnot = new mongoose.Schema({
    msg : {
        type : String,
        required : [true,'give a msg'],
        trim : true , 
        maxLength : [144,'144 characters max'],
    },
    lc_id : {
        type : String,
        required : [true,'give an lc id'],
        trim : true , 
        maxLength : [20,'20 characters max'],
    },
    msg_time : {
        type : Number,
        require : true ,
    }
});

let notification = new mongoose.Schema({
    username : {
        type : String,
    },
    notifications : [subnot] ,
});

module.exports = mongoose.model('notification',notification);