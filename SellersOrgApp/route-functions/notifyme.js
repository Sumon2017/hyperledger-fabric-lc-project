const path = require('path');
const notification = require(path.join(__dirname,'..','db-schemas','notification'));

const notifyMe = async (req,res) => {
    const { username , msg , lc_id , msg_time } = req.body;
    try{
        let result = await notification.find({username}).exec();
        if(result.length){
            result = result[0];
            result.notifications.push({
                msg,
                lc_id,
                msg_time
            });
            await notification.findByIdAndUpdate(result._id,result);
        }
        else{
            let obj = {
                username,
                notifications : [{
                    msg,
                    lc_id,
                    msg_time
                }]
            }
            await notification.create(obj);
        }
    }
    catch(err){
        console.log(err);
    }
    res.json({});
};

module.exports=notifyMe;