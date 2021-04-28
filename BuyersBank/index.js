const path = require('path');
const express = require('express');
const  connectDB  = require(path.join(__dirname,'connect-db'));
require('dotenv').config();
const bodyParser = require('body-parser');
const makeWallet =require(path.join(__dirname,'fabric-network','make-wallet'));
const callFabric = require(path.join(__dirname,'fabric-network','call-fabric'));
const subnot = require(path.join(__dirname,'db-schemas','sub-notification'));
const sendNot = require(path.join(__dirname,'sendnot'));

//connecting to mongodb atlas cloud
connectDB();
makeWallet();

var app = express();

app.use(bodyParser.json());

app.post('/buyersbankverify',async (req,res) => {
    const { lc_id } = req.body;
    let result = await callFabric('BuyersBankVerify',[`${lc_id}`]);
    const c_time = Date.now();
    result=await JSON.parse(result);
    if(result.msg=='success'){
        await sendNot('http://localhost:3001/notifyme',{
            username : result.value.buyers_id,
            msg : 'buyers bank verified and issued this lc',
            lc_id : result.value.lc_id,
            msg_time : c_time
        });
        await sendNot('http://localhost:3002/notifyme',{
            username : result.value.sellers_id,
            msg : 'buyers bank verified and issued this lc',
            lc_id : result.value.lc_id,
            msg_time : c_time
        });
        await sendNot('http://localhost:3004/notifyme',{
            msg : 'buyers bank verified and issued this lc',
            lc_id : result.value.lc_id,
            msg_time : c_time
        });
    }
    res.json(result);
});


app.post('/buyersbanktransaction',async (req,res) => {
    const { lc_id , obj } = req.body;
    let result = await callFabric('BuyersBankTransaction',[`${lc_id}`,obj]);
    const c_time = Date.now();
    result=await JSON.parse(result);
    if(result.msg=='success'){
        await sendNot('http://localhost:3001/notifyme',{
            username : result.value.buyers_id,
            msg : 'buyers bank sent the money . all done',
            lc_id : result.value.lc_id,
            msg_time : c_time
        });
        await sendNot('http://localhost:3002/notifyme',{
            username : result.value.sellers_id,
            msg : 'buyers bank sent the money . all done',
            lc_id : result.value.lc_id,
            msg_time : c_time
        });
        await sendNot('http://localhost:3004/notifyme',{
            msg : 'buyers bank sent the money . all done',
            lc_id : result.value.lc_id,
            msg_time : c_time
        });
    }
    res.json(result);
});

app.post('/notifyme', async (req,res) => {
    const { msg , lc_id , msg_time } = req.body;
    await subnot.create({
        msg,
        lc_id,
        msg_time
    });
    res.json({});
});


app.get('/getallnotification', async (req,res) => {
    let arr = await subnot.find({});
    res.json(arr);
});


app.listen(3003);