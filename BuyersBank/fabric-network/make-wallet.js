const { Wallets , Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const makeWallet = async () => {

    const certificate = fs.readFileSync(path.join(__dirname,'..','credentials','cert.pem')).toString();
    const privateKey = fs.readFileSync(path.join(__dirname,'..','credentials','sk')).toString();


    const wallet = await Wallets.newFileSystemWallet(path.join(__dirname,'..','wallets'));

    const identity = {
        credentials: {
            certificate,
            privateKey
        },
        mspId: 'Org3MSP',
        type: 'X.509',
    };
    await wallet.put('ourserver3', identity);

    console.log('wallet created');

}

module.exports=makeWallet;
