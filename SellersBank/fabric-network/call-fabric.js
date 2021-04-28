const { Wallets , Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');


const callFabric = async( transaction_name , args ) => {

    const gateway = new Gateway();

    try{

        const connectionProfileJson = (await fs.promises.readFile(path.join(__dirname,'..','credentials','connection-org4.json'))).toString();
        const connectionProfile = JSON.parse(connectionProfileJson);
        const wallet = await Wallets.newFileSystemWallet(path.join(__dirname,'..','wallets'));
        const gatewayOptions = {
            identity: 'ourserver4', 
            wallet,
        };

        
        await gateway.connect(connectionProfile, gatewayOptions);


        const network = await gateway.getNetwork('lcchannelcore');
        const contract = await network.getContract('lccontract');

        const submitResult = await contract.submitTransaction( transaction_name , ...args );

        const msg = new Buffer.from(submitResult).toString();

        await gateway.disconnect();

        return msg;
    }
    catch(error){
        console.log(error);
    }
    finally {
        gateway.disconnect();
    }

}


module.exports=callFabric;