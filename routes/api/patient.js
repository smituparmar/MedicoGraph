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
                return res.status(400).json({
                success:false,
                message:errors,
                data:""
            });
            }

            const patientData = await Patient.findOne({user:req.user.id});
            if(patientData){
                return res.status(400).json({
                    success:false,
                    message:"You can only update now, you cannot create more than one record",
                    data:""
                });
            }

            const { father, mother, sibling } = req.body;

            const fatherID = await User.findOne({email:father});
            const motherID = await User.findOne({email:mother});
            let siblingList = [];
            for(i in sibling){
                let siblingElement = await User.findOne({email:sibling[i]});
                siblingList.push(siblingElement.id);
            }

            if(!fatherID || !motherID){
                return res.status(400).json({
                    success:false,
                    message:"Please Enter valid email",
                    data:""
                });
            }

            let patient = new Patient({
                user: req.user.id,
                father: fatherID._id,
                mother: motherID._id,
                sibling: siblingList,
            });

            await patient.save();

            patient = await Patient.findOne({userId:req.user._id});

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
    auth,
    [
        check('id','ID of Patient is required').exists()
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
            const { id, father, mother } = req.body;
            
            const college = await College.findById(id);

            const updateCollegeBody = {
                name: name?name:college.name,
                email : email?email:college.email,
                phone : phone?phone:college.phone,
                address:{
                    street : street?street:college.address.street,
                    city : city?city:college.address.city,
                    state : state?state:college.address.state,
                    zip : zip?zip:college.address.zip,
                    country: country?country:college.address.country,
                },
                userId: req.user._id
            };

            await College.findByIdAndUpdate(id,updateCollegeBody);
            
            const updatedCollege = await College.findById(id);

            res.status(200).send({
                success:true,
                message:"",
                data:updatedCollege
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
