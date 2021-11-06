const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

module.exports = async (req,res,next) => {

    try{

        if(req.user.type!="doctor"){
            return res.status(400).send({
                success:false,
                message:"Only doctor can make this call111",
                data:""
            });
        }
        
        next();
    }
    catch(err)
    {
        console.log(err)
        return res.status(400).send({
            success:false,
            message:"Only doctor can make this call",
            data:""
        });
    }
};