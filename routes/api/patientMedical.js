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

// @route   GET api/record
// @desc    get user's college information
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

// @route   post api/patientmedical/create
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

            const newPatientMedical = await PatientMedical.save();

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

// @route   PUT api/patientmedicalupdate
// @desc    update Patient's medicals
// @access   Private
router.put('/update',[
    auth,
    [
        check('id','ID of the patient is required').exists()
    ]],
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
            const { id, bloodGroup, height, weight, hasDiabetes, hasHeartDisease, hasArthirtis, hasBloodPressureProblem } = req.body;
            
            const patientmedical = await PatientMedical.findById(id);

            const updatePatientMedicalBody = {
                bloodGroup: bloodGroup ? bloodGroup : patientmedical.bloodGroup,
                height: height ? height : patientmedical.height,
                weight: weight ? weight : patientmedical.weight, 
                hasDiabetes: hasDiabetes ? hasDiabetes : patientmedical.hasDiabetes, 
                hasHeartDisease: hasHeartDisease ? hasHeartDisease : patientmedical.hasHeartDisease,
                hasArthirtis: hasArthirtis ? hasArthirtis : patientmedical.hasArthirtis,
                hasBloodPressureProblem: hasBloodPressureProblem ? hasBloodPressureProblem : patientmedical.hasBloodPressureProblem,
                user: req.user.id
            };

            const updatedPatientMedical = await PatientMedical.findByIdAndUpdate(id,updatePatientMedicalBody);
            

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
    auth,[
        check('id','Id of paitientMedial Table is required').exists()
    ]
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
        const {id} = req.body;

        const patientMedical = await patientMedical.findByIdAndRemove(id);
        
        res.status(200).json({
            success:true,
            message:"",
            data:record
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
