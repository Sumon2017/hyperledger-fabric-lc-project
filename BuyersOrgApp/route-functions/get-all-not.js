const path = require('path');
const notification = require(path.join(__dirname,'..','db-schemas','notification'));

const getAllNot = async (req,res) => {

    const username = res.locals.username;
    try{
        let result = await notification.find({username}).exec();
        if(result.length==0){
            res.json([]);
        }
        else{
            result=result[0];
            res.json(result.notifications);
        }
    }
    catch(err){
        console.log(err);
    }

};


module.exports=getAllNot;