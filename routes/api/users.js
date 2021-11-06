const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require("config");
const router = express.Router();
const {check, validationResult} = require('express-validator');

const User = require('../../models/User');


// @route    POST api/users
// @desc     Test route
// @access   Public 
router.post('/',[
  check('name','Name is required').not().isEmpty(),
  check('email','include email').isEmail(),
  check('password','correct password required').isLength(min=6)
],
async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).send({
            success:false,
            message:err.message,
            data:""
        });
    }

    const {name, email, password} = req.body;

    try
    {
        //see if user exists
        let user = await User.findOne({email});

        if(user)
        {
            return res.status(400).send({
                success:false,
                message:"User already exists",
                data:""
            });
        }


        //get user gravatar

        const avatar = gravatar.url({
            s:'200',
            r:'pg',
            d:'mm',
        });

        user = new User({
            name,
            email,
            password,
            avatar
        });
        // encrypt password

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password,salt);

        await user.save();

        //return JWT
        const payload ={
                user:{
                    id: user.id,
                }
        }

        jwt.sign(
            payload,
            config.get("jwtSecret"),
            {expiresIn:360000},
            (err,token) => {
                if(err) throw err;
                res.json({token});
            }
        );
    
    }
    catch(err)
    {
        console.log(err.message);
        res.status(500).send({
            success:false,
            message:"Server error",
            data:""
        });
    }
    
});

module.exports = router;