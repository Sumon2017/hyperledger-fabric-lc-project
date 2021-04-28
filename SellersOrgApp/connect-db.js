const Mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    const conn = await Mongoose.connect(process.env.MONGO_DB_URI,{
        useNewUrlParser:true,
        useCreateIndex:true,
        useFindAndModify:false,
        useUnifiedTopology:true
    });

    console.log(`Database connected : ${conn.connection.host}`);
}

module.exports = connectDB;