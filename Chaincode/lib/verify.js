const { eddsa } = require('elliptic');
const ec = new eddsa('ed25519');


const verify = async ( obj , hex_public_key , sign ) => {
    const key = ec.keyFromPublic(hex_public_key,'hex');
    const msg = JSON.stringify(obj);
    const result = key.verify(msg,sign);
    return result ; 
}

module.exports=verify;