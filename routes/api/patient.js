const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require("config");

const Patient = require('../../models/Patient');
const User = require('../../models/User');


// @route   GET api/patient
// @desc    get user's family informations
// @access   Private
router.get('/',auth,async (req,res)=>{
    try{
        const patient  = await Patient.find({user:req.user._id})
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
        res.status(500).send({
            success:false,
            message:err.message,
            data:""
        });
    }
});

// @route   post api/patient/create
// @desc    create new Patient Relationship
// @access   Private
router.post('/create',[
    auth,
    [
        check('father','Father email is required').isEmail().exists(),
        check('mother','Mother email is required').isEmail().exists(),
        check('sibling','Sibling details is required'),
    ]],
    async (req,res) => {

        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                console.log(errors)
                return res.status(400).send({
                    success:false,
                    message:errors,
                    data:""
                });
            }

            const patientData = await Patient.findOne({user:req.user.id});
            if(patientData){
                return res.status(400).send({
                    success:false,
                    message:"You can only update now, you can create only one record",
                    data:""
                });
            }

            const { father, mother, sibling } = req.body;

            const fatherID = await User.findOne({email:father});
            const motherID = await User.findOne({email:mother});
            let siblingList = [];
            for(i in sibling){
                let siblingElement = await User.findOne({email:sibling[i]});
                if(!siblingElement){
                    return res.status(400).send({
                        success:false,
                        message:"Please enter valid email",
                        data:""
                    });
                }
                siblingList.push(siblingElement.id);
            }

            if(!fatherID || !motherID){
                return res.status(400).send({
                    success:false,
                    message:"Please enter valid email",
                    data:""
                });
            }

            let patient = new Patient({
                user: req.user.id,
                father: fatherID._id,
                mother: motherID._id,
                sibling: siblingList,
            });

            patient = await patient.save();

            res.status(200).send({
                success:true,
                message:"",
                data:patient
            });

        } catch (error) {
            //console.log(error.message)
            res.status(500).send({
            success:false,
            message:error.message,
            data:""
        });
        }
        
    }
);

// @route   PUT api/patient/update
// @desc    update user's Family Infor
// @access   Private
router.put('/update',[
    auth],
    async (req,res) => {

        const errors = validationResult(req);
        if(!errors.isEmpty())
        {
            console.log(errors)
            return res.status(400).send({
                success:false,
                message:errors.message,
                data:""
            });
        }
        try {
            const {  father, mother, sibling } = req.body;
            
            const fatherID = await User.findOne({email:father});
            const motherID = await User.findOne({email:mother});
            let siblingList = [];
            for(i in sibling){
                let siblingElement = await User.findOne({email:sibling[i]});
                if(!siblingElement){
                    return res.status(400).send({
                        success:false,
                        message:"Please enter valid email",
                        data:""
                    });
                }
                siblingList.push(siblingElement.id);
            }

            if(!fatherID || !motherID){
                return res.status(400).send({
                    success:false,
                    message:"Please enter valid email",
                    data:""
                });
            }

            const updatePatientBody = {
                user: req.user.id,
                father: fatherID._id,
                mother: motherID._id,
                sibling: siblingList,
            }

            let patient = await Patient.findOne({user:req.user._id});

            await Patient.findByIdAndUpdate(patient._id, updatePatientBody )

            patient = await Patient.findOne({users:req.user._id});

            res.status(200).send({
                success:true,
                message:"",
                data:patient
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


module.exports = router;
