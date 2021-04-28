const path = require('path');
const callFabric = require(path.join(__dirname,'..','fabric-network','call-fabric'));

const getAllLc = async (req,res) => {

    const username = res.locals.username;
    const result = await callFabric('GetAllAssetsBuyers', [`${username}`] );
    res.json(JSON.parse(result));
    
};

module.exports=getAllLc;