const path = require('path');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const requestIp = require('request-ip');
require('dotenv').config();
const users = require(path.join(__dirname,'..','db-schemas','users'));

const login = async (req,res) => {

    const cookieConfig = {
        httpOnly: true,
        //secure: true,
        signed: true
    };

    const { email , password } = req.body;

    let model = await users.find({email});

    if(model.length==0){
        res.json({
            msg : 'no account with this email'
        });
        return ;
    }

    model=model[0];

    const username = model.username;

    bcrypt.compare(password, model.password).then(function(result) {
        if(result){
            const ip = requestIp.getClientIp(req);
            jwt.sign({username,ip}, process.env.SERVER_SECRET , { expiresIn: '1h' }, async (err,token) => {
                if(err){
                    console.log(err);
                    return ;
                }
                res.cookie('lcproject', token , cookieConfig);
                res.json({
                    msg : 'you are logged in'
                });
            });
        }
        else{
            res.json({
                msg : 'incorrect password'
            });
        }
    });

}

module.exports=login;