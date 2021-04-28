var express = require('express');
const bodyParser = require('body-parser');
const {eddsa} = require('elliptic');

const ec = new eddsa('ed25519');

let app = express();

app.use(bodyParser.json());

app.post('/',async (req,res) => {
    const { secret , obj } = req.body;
    const key = ec.keyFromSecret(secret);
    const public_key = key.getPublic();
    const hex_public_key = new Buffer.from(public_key).toString('hex');
    const msg = JSON.stringify(obj);
    const sign = key.sign(msg).toHex();
    res.json({
        msg : 'success',
        hex_public_key,
        sign
    });
    console.log('response sent')
});

app.listen(3005,()=>{
    console.log('listening on port 3005');
});