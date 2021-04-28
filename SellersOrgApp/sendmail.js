require('dotenv').config();
const mailjet = require ('node-mailjet').connect(process.env.MAILJET_X,process.env.MAILJET_Y);

const send = async ( email , code ) => {
    const request = mailjet.post("send", {'version': 'v3.1'}).request({

        "Messages":[
          {
            "From": {
              "Email": "zksumon2017@gmail.com",
              "Name": "LC-Project"
            },
            "To": [
              {
                "Email": `${email}`,
                "Name": ''
              }
            ],
            "Subject": "Verification Code",
            "TextPart": `${code}`,
            "HTMLPart": `<h1>${code}</h1>`,
            "CustomID": "AppGettingStartedTest"
          }
        ]
    });

    request.then((result) => {
        console.log(result.body)
    }).catch((err) => {
        console.log(err.statusCode)
    });
};

module.exports.send=send;