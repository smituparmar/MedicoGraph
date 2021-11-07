const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require("config");
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');
const gravatar = require('gravatar')

const User = require('../../models/User');
const Patient = require('../../models/Patient');
const PatientMedical = require('../../models/PatientMedical');
const Records = require('../../models/Records');


// @route    GET api/auth
// @desc     get signed in user data
// @access   Public
router.get('/',auth,async (req,res)=>{
    try{
        const user = await User.findById(req.user.id).select('-password');
        return res.status(200).send({
            success:true,
            message:"",
            data:user
        });
    }
    catch(err){
        console.log(err.message);
        res.status(500).send({
            success:false,
            message:err.message,
            data:""
        });
    }
});

// @route    POST api/auth/login
// @desc     login route
// @access   Public
router.post('/login',[
    check('email','include email').isEmail(),
    check('password','correct password required').exists("password required")
  ],
  async (req,res)=>{
      const errors = validationResult(req);
      if(!errors.isEmpty())
      {
          return res.status(400).send({
            success:false,
            message:errors,
            data:""
        });
      }
  
      const {email, password} = req.body;
  
      try
      {
          //see if user exists
          let user = await User.findOne({email});
  
          if(!user)
          {
              return res.status(400).send({
                success:false,
                message:"Email or password is invalid",
                data:""
            });
          }
  
          const isMatch = await bcrypt.compare(password,user.password);
          if(!isMatch)
          {
            return res.status(400).send({
                success:false,
                message:"Invalid ID or Password",
                data:""
            });
          }

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
                  res.status(200).send({
                    success:true,
                    message:"",
                    data:{
                        token,
                        newUser: user.newUser
                    }
                });
              }
          );
      
      }
      catch(err)
      {
          console.log(err.message);
          res.status(500).send({
            success:false,
            message:err.message,
            data:""
        });
      }
      
  });

  
// @route    POST api/auth/register
// @desc     register route
// @access   Public
  router.post('/register',[
    check('email','include email').isEmail(),
    check('password','correct password required').exists("password required"),
    check("first_name","First Name is required").exists(),
    check("last_name","Last Name is required").exists()
  ], async (req, res) => {

    // Check Validation
    const errors = validationResult(req);
      if(!errors.isEmpty()){
        console.log(errors)
        return res.status(400).send({
        success:false,
        message:errors,
        data:""
    });
    }
    
    const {first_name, last_name, email, password} = req.body;
    const user = await User.findOne({ email })
    
    if (user) {
        errors.email = 'Email already exists';
        return  res.status(400).send({
            success:false,
            message:errors.email,
            data:""
        });
    }

    const avatar = await gravatar.url(req.body.email, {
    s: '200', // Size
    r: 'pg', // Rating
    d: 'mm' // Default
    });
    
  
    const newUser = new User({
        email,
        avatar,
        password,
        first_name,
        last_name,
    });
  
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    const newUserRegistered = await newUser.save();
    return res.status(200).send({
        success:true,
        message:"",
        data:newUserRegistered
    });
   }
);

// @route    PUT api/auth/update
// @desc     Update route
// @access   Private
router.put('/update', auth
,async (req, res) => {

    try {
        let {
            email,
            first_name,
            last_name, 
            phone,
            type,
            street,
            city,
            state,
            zip,
            country,
            newUser,
            avatar,
        } = req.body;

        const updateUserBody = {
            email : email ? email : req.user.email,
            first_name : first_name ? first_name : req.user.first_name,
            last_name : last_name ? last_name : req.user.last_name,
            phone : phone ? phone : req.user.phone,
            type : type ? type : req.user.type,
            address:{
                street : street ? street : req.user.address.street,
                city : city ? city : req.user.address.city,
                state : state ? state : req.user.address.state,
                zip : zip ? zip : req.user.address.zip,
                country: country ? country : req.user.country,
            },
            avatar: avatar ? avatar : req.user.avatar,
            newUser: newUser!=null ? newUser : req.user.newUser
        }

        await User.findByIdAndUpdate(req.user._id,updateUserBody);

        let user = await User.findById(req.user._id).select("-password");
        
        res.status(200).send({
            success:true,
            message:"",
            data:user
        });

    
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Internal Server Error",
            data:""
        });
    }   
});


// @route    DELETE api/auth/delete
// @desc     delete route
// @access   Private
router.delete('/delete',[
    auth,
],async (req, res) => {

    const errors = validationResult(req);
      if(!errors.isEmpty()){
        console.log(errors)
      return res.status(400).send({
        success:false,
        message:err.message,
        data:""
    });
    }   

    try {
        
        const user =await User.findByIdAndRemove(req.user._id).select("-password");
        await Patient.findOneAndRemove({user:req.user._id});
        await Records.remove({user:req.user._id});
        await PatientMedical.findOneAndRemove({user:req.user._id});
        
        res.status(200).send({
            success:true,
            message:"",
            data:user
        });

    
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Internal Server Error",
            data:""
        });
    }   
});



module.exports = router;