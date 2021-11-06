const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

module.exports = async (req,res,next) => {
    // Get token from header
    const token = req.header('x-auth-token');
    //check if no token
    if(!token)
    {
        return  res.status(500).send({
            success:false,
            message:"Token is invalid",
            data:""
        });;
    }

    //verify token
    try{
        const decoded = jwt.verify(token,config.get('jwtSecret'));
        const user =  await User.findById(decoded.user.id).select("-password");
        req.user = user;
        next();
    }
    catch(err)
    {
        return res.status(500).send({
            success:false,
            message:"Token is invalid",
            data:""
        });
    }
};