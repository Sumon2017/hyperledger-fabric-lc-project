const getHash = async ( str ) => {
    const hash = require('crypto').createHash('md5').update(str).digest("hex");
    return hash ; 
}

module.exports=getHash;