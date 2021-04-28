const path = require('path');
const fetch = require('node-fetch');

let sendNot = async ( url , obj) => {
    const { msg , lc_id , msg_time } = obj;
    let data = {
        msg,
        lc_id,
        msg_time
    };
    if(obj.username){
        data.username = obj.username ; 
    }


    data=JSON.stringify(data);

    fetch( url , {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : data
    }).then((r)=>{
        //
    }).catch((err)=>{
        console.log("notification not sent");
    });

};

module.exports=sendNot;