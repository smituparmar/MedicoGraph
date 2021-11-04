const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require("config");

const Patient = require('../../models/Patient');
const User = require('../../models/User');


// @route   GET api/patient
// @desc    get user's family information
// @access   Private
router.get('/',auth,async (req,res)=>{
    try{
        const patient  = await patient.find({user:req.user._id})
                        .populate('user')
                        .populate('mother')
                        .populate('father')
                        .populate('sibling');

        return res.status(200).send({
            success:true,
            message:"",
            data:patient
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