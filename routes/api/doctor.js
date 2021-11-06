const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');
const isDoctor = require('../../middleware/isDoctor');

const User = require('../../models/User');
const Patient = require('../../models/Patient');
const PatientMedical = require('../../models/PatientMedical');
const Records = require('../../models/Records');

// @route   GET api/doctor/:email
// @desc    get user's basic info for doctor
// @access   Private
router.get('/:email',[auth, isDoctor],async (req,res)=>{
    try{
        const {email} = req.params

        let user = await User.findOne({email});
        if(!user){
            return res.status(400).send({
                success:false,
                message:"Please Enter email address",
                data:""
            });
        }

        const patientMedical = await PatientMedical.findOne({user:user._id});

        const userInfo = {
            first_name: user.first_name,
            last_name: user.last_name,
            dateOfBirth: user.dateOfBirth
        }

        return res.status(200).send({
            success:true,
            message:"",
            data:{user: userInfo, patientMedical}
        }); 
}
    catch(err){
        console.log(err.message);
        return res.status(500).send({
            success:false,
            message:err.message,
            data:""
        });
    }
});

// @route   GET api/doctor/:email
// @desc    get user's basic info for doctor
// @access   Private
router.get('/family/:email',[auth, isDoctor],async (req,res)=>{
    try{
        const {email} = req.params

        let user = await User.findOne({email});
        if(!user){
            return res.status(400).send({
                success:false,
                message:"Please Enter email address",
                data:""
            });
        }

        const patient = await Patient.find({user:user._id})
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
        return res.status(500).send({
            success:false,
            message:err.message,
            data:""
        });
    }
});

// @route   GET api/doctor/:email
// @desc    get user's basic info for doctor
// @access   Private
router.get('/records/:email',[auth, isDoctor],async (req,res)=>{
    try{
        const {email} = req.params

        let user = await User.findOne({email});
        if(!user){
            return res.status(400).send({
                success:false,
                message:"Please Enter email address",
                data:""
            });
        }

        const records = await Record.find({user:user._id})

        return res.status(200).send({
            success:true,
            message:"",
            data:records
        }); 
}
    catch(err){
        console.log(err.message);
        return res.status(500).send({
            success:false,
            message:err.message,
            data:""
        });
    }
});


module.exports = router;