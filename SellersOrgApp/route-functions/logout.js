const logout = async (req,res) => {
    res.clearCookie('lcproject');
    res.json({
        msg : 'logged out'
    });
};

module.exports=logout;