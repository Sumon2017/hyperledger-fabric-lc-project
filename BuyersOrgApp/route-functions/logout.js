const logout = async (req,res) => {
    res.clearCookie('lcprojecto');
    res.json({
        msg : 'logged out'
    });
};

module.exports=logout;