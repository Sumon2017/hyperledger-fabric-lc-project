const path = require('path');
const callFabric = require(path.join(__dirname,'..','fabric-network','call-fabric'));
const sendNot =require(path.join(__dirname,'..','sendnot'));

const buyersVerify = async (req,res) => {

    let { lc_id , buyers_public_key , buyers_sign } = req.body;
    let arr = [ lc_id , buyers_public_key , buyers_sign ] ;
    let result = await callFabric('BuyersVerify', arr );
    const c_time = Date.now();
    result=await JSON.parse(result);
    if(result.msg=='success'){
        await sendNot('http://localhost:3003/notifyme',{
            msg : 'a new lc signed , pls verify',
            lc_id : result.value.lc_id,
            msg_time : c_time
        });
    }
    res.json(result);
    
};

module.exports=buyersVerify;