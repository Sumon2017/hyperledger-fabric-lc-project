const path = require('path');
const requestIp = require('request-ip');
var jwt = require('jsonwebtoken');

const auth = async (req,res,next) => {
    const ip = requestIp.getClientIp(req);
    const token = req.signedCookies.lcproject;
    if(!token){
        res.json({
            msg : 'no access token'
        });
        return ;
    }
    jwt.verify( token , process.env.SERVER_SECRET , async (err , decoded ) => {
        if(err){
            res.json({
                msg : 'expired login again'
            });
            console.log(err);
            return ;
        }
        if(ip!=decoded.ip){
            res.json({
                msg : 'ip changed , pls login again'
            });
            return ;
        }
        res.locals.username=decoded.username;
        console.log('ok');
        next();
    });
};

module.exports=auth;