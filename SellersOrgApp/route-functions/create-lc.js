const path = require('path');
const callFabric = require(path.join(__dirname,'..','fabric-network','call-fabric'));
const sendNot =require(path.join(__dirname,'..','sendnot'));

const createLc = async (req,res) => {

    let {
        buyers_id,
        sellers_id,
        carrier_org_id,
        ammount,
        product_details_obj,
        expire_time,
        sellers_public_key,
        sellers_sign
    } = req.body;

    

    let arr = [
        buyers_id,
        sellers_id,
        carrier_org_id,
        ammount,
        product_details_obj,
        expire_time,
        sellers_public_key,
        sellers_sign
    ];

    let result = await callFabric('CreateLC', arr );
    const c_time = Date.now();
    result = await JSON.parse(result);
    if(result.msg=='success'){
        await sendNot('http://localhost:3001/notifyme',{
            username : result.value.buyers_id,
            msg : 'this lc is created on you , pls sign and verify it',
            lc_id : result.value.lc_id,
            msg_time : c_time
        });
    }

    res.json(result);
    
};

module.exports=createLc;