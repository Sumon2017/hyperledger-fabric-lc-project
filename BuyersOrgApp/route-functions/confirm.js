const path = require('path');
const users = require(path.join(__dirname,'..','db-schemas','users'));
const confirmation = require(path.join(__dirname,'..','db-schemas','confirmation'));

const confirm= async (req,res) => {
    let { email , code  } = req.body;
    let data = await confirmation.find({email});
    if(data.length==0){
        res.json({
            msg : 'invalid'
        });
        return ;
    }
    data=data[0];
    if(data.confirmation==code){
        users.create({
            username : data.username,
            email : data.email,
            password : data.password
        }).then(()=>{
            confirmation.findByIdAndRemove(data._id).then(()=>{
                res.json({
                    msg:'account created'
                });
            });
        });
    }
    else{
        res.json({
            msg : 'code didn\'t match'
        });
    }
}

module.exports=confirm;