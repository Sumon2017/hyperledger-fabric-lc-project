const mongoose = require('mongoose');

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

module.exports = mongoose.model('subnot',subnot);