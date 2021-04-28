const path = require('path');
const bcrypt = require('bcrypt');
const users = require(path.join(__dirname,'..','db-schemas','users'));
const confirmation = require(path.join(__dirname,'..','db-schemas','confirmation'));
const sendmail = require(path.join(__dirname,'..','sendmail'));

const signup = async (req,res) => {
    let { username , email , password  } = req.body;
    let user;
    try{
        user = await users.find({username}).exec();
        if(user.length){
            res.json({
                msg:'username already exists'
            });
            return ;
        }
    }
    catch(err){
        console.log(err);
    }
    try{
        user = await users.find({email}).exec();
        if(user.length){
            res.json({
                msg:'account already exists with this email'
            });
            return ;
        }
    }
    catch(err){
        console.log(err);
    }


    let result;
    try{
        result = await confirmation.find({username}).exec();
        if(result.length!=0){
            result=result[0];
            await confirmation.findByIdAndRemove(result._id);
        }
    }
    catch(err){
        console.log(err);
    }
    try{
        result = await confirmation.find({email}).exec();
        if(result.length!=0){
            result=result[0];
            await confirmation.findByIdAndRemove(result._id);
        }
    }
    catch(err){
        console.log(err);
    }
    

    try{
        const code = Math.floor(Math.random()*1000000);

        await sendmail.send(email,code);

        bcrypt.hash(password, 11).then(async(hash)=>{
            confirmation.create({
                username,
                email,
                password : hash ,
                confirmation : code,
    
            }).then(async()=>{
                res.json({
                    msg:'code sent'
                });
            });
        });

    }
    catch(err){
        console.log(err);
    }
    
};


module.exports=signup;