const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require("config");

const PatientMedical = require('../../models/PatientMedical');

// @route   GET api/patientmedicals
// @desc    get user's medical information
// @access   Private
router.get('/',auth,async (req,res)=>{
    try{
        const patientMedicals = await PatientMedical.find({user:req.user.id});
        return res.status(200).send({
            success:true,
            message:"",
            data:patientMedicals
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

// @route   GET api/medical
// @desc    get user's medical information by ID
// @access   Private
router.get('/:id',auth,async (req,res)=>{
    try{
        const {id} = req.params
        const patientMedical = await PatientMedical.findById(id);
        return res.status(200).send({
            success:true,
            message:"",
            data:patientMedical
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

// @route   post api/medical/create
// @desc    create new Patient's medicals
// @access   Private
router.post('/create',[
    auth,
    [
        check('bloodGroup','bloodGroup is required').exists(),
        check('height','height is required').exists(),
        check('weight','weight is required').exists(),
        check('hasDiabetes','diabetes is required').exists(),
        check('hasHeartDisease','heart disease is required').exists(),
        check('hasArthritis','arthiritis is required').exists(),
        check('hasBloodPressureProblem','Blood Pressure Problem is required').exists(),
    ]],
    async (req,res) => {

        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                console.log(errors)
                return res.status(400).json({
                success:false,
                message:errors,
                data:""
            });
            }

            const patientMedicalData = await PatientMedical.findOne({user:req.user.id});
            if(patientMedicalData){
                return res.status(400).json({
                    success:false,
                    message:"You can only update now, you cannot create more than one record",
                    data:""
                });
            }

            const { bloodgroup, height, weight, hasDiabetes, hasHeartDisease, hasArthirtis, hasBloodPressureProblem } = req.body;

            let patientmedical = new PatientMedical({
                bloodgroup,
                height,
                weight,
                hasDiabetes,
                hasHeartDisease,
                hasArthirtis,
                hasBloodPressureProblem,
                user: req.user._id
            });

            const newPatientMedical = await patientmedical.save();

            res.status(200).send({
                success:true,
                message:"",
                data:newPatientMedical
            });

        } catch (error) {
            res.status(500).send({
            success:false,
            message:error.message,
            data:""
        });
        }
        
    }
);

// @route   PUT api/medical/update
// @desc    update Patient's medicals
// @access   Private
router.put('/update',[
    auth],
    async (req,res) => {

        const errors = validationResult(req);
        if(!errors.isEmpty())
        {
            console.log(errors)
            return res.status(400).json({
            success:false,
            message:errors,
            data:""
        });
        }
        try {
            const medicalRecord = await PatientMedical.findOne({user:req.user.id});
            if(!medicalRecord){
                return res.status(400).json({
                    success:false,
                    message:"Please Enter data first",
                    data:""
                });
            }
            const { bloodGroup, height, weight, hasDiabetes, hasHeartDisease, hasArthirtis, hasBloodPressureProblem } = req.body;
            
            const patientmedical = await PatientMedical.findById(medicalRecord._id);

            const updatePatientMedicalBody = {
                bloodGroup: bloodGroup ? bloodGroup : patientmedical.bloodGroup,
                height: height ? height : patientmedical.height,
                weight: weight ? weight : patientmedical.weight, 
                hasDiabetes: hasDiabetes!=null ? hasDiabetes : patientmedical.hasDiabetes, 
                hasHeartDisease: hasHeartDisease!=null ? hasHeartDisease : patientmedical.hasHeartDisease,
                hasArthirtis: hasArthirtis!=null ? hasArthirtis : patientmedical.hasArthirtis,
                hasBloodPressureProblem: hasBloodPressureProblem!=null ? hasBloodPressureProblem : patientmedical.hasBloodPressureProblem,
                user: req.user.id
            };

            await PatientMedical.findByIdAndUpdate(medicalRecord._id,updatePatientMedicalBody);
            
            const updatedPatientMedical = await PatientMedical.findById(medicalRecord._id);

            res.status(200).send({
                success:true,
                message:"",
                data:updatedPatientMedical
            });

        } catch (error) {
            res.status(500).send({
            success:false,
            message:error.message,
            data:""
        });
        }   
    }
);

// @route   DELETE api/patientmedical/delete
// @desc    delete Patient's medicals
// @access   Private
router.delete('/delete',[
    auth,
],
async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        console.log(errors)
        return res.status(400).json({
        success:false,
        message:errors,
        data:""
    });
    }
    try {

        const medicalRecord = await PatientMedical.findOne({user:req.user.id});
        if(!medicalRecord){
            return res.status(400).json({
                success:false,
                message:"Please Enter data first",
                data:""
            });
        }

        const patientMedical = await PatientMedical.findByIdAndRemove(medicalRecord._id);
        
        res.status(200).json({
            success:true,
            message:"",
            data:patientMedical
        });

    } catch (error) {
        res.status(500).send({
            success:false,
            message:error.message,
            data:""
        });
    }

})
module.exports = router;
