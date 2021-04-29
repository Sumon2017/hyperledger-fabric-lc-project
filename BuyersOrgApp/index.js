const path = require('path');
const express = require('express');
const  connectDB  = require(path.join(__dirname,'connect-db'));
require('dotenv').config();
const router = require(path.join(__dirname,'router'));
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const makeWallet =require(path.join(__dirname,'fabric-network','make-wallet'));

//connecting to mongodb atlas cloud
connectDB();
makeWallet();

var app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/',router);

app.listen(3001);