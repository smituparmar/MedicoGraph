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
            dateOfBirth: user.dateOfBirth,
            email: user.email
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
        const patient = await Patient.findOne({user:user._id})
                        .populate('user')
                        .populate('mother')
                        .populate('father')
                        .populate('sibling');
        const motherPatientMedical = await PatientMedical.findOne({user:patient.mother._id});

        const motherInfo = {
            first_name: patient.mother.first_name,
            last_name: patient.mother.last_name,
            dateOfBirth: patient.mother.dateOfBirth,
            email: patient.mother.email
        }

        const fatherPatientMedical = await PatientMedical.findOne({user:patient.father._id});

        const fatherInfo = {
            first_name: patient.father.first_name,
            last_name: patient.father.last_name,
            dateOfBirth: patient.father.dateOfBirth,
            email: patient.father.email
        }

        let siblingArray = []
        for(i in patient.sibling){
            const siblingMedical = await PatientMedical.findOne({user:patient.sibling[i]._id});

            const siblingInfo = {
                first_name: patient.sibling[i].first_name,
                last_name: patient.sibling[i].last_name,
                dateOfBirth: patient.sibling[i].dateOfBirth,
                email: patient.sibling[i].email
            }

            siblingArray.push({patientMedical:siblingMedical, user:siblingInfo})
        }


        return res.status(200).send({
            success:true,
            message:"",
            data:{
                mother:{
                    patientMedical:motherPatientMedical,
                    user:motherInfo
                },
                father:{
                    patientMedical:fatherPatientMedical,
                    user:fatherInfo
                },
                sibling:siblingArray
            }
        }); 
}
    catch(err){
        console.log(err);
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