const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require("config");

const Records = require('../../models/Records');


// @route   GET api/record
// @desc    get user's college information
// @access   Private
router.get('/',auth,async (req,res)=>{
    try{
        const records = await Records.find({user:req.user.id});
        // req.io.emit("message","Hey!")
        return res.status(200).send({
            success:true,
            message:"",
            data:records
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

// @route   post api/record/create
// @desc    create new Medical Record
// @access   Private
router.post('/create',[
    auth,
    [
        check('hemoglobin','hemoglobin is required').exists(),
        check('sugarLevel','sugarLevel is required').exists(),
        check('rbcCount','rbcCount is required').exists(),
        check('wbcCount','wbcCount is required').exists(),
        check('lBloodPressure','lBloodPressure is required').exists(),
        check('rBloodPressure','rBloodPressure is required').exists(),
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

            const { hemoglobin, sugarLevel, rbcCount, wbcCount, lBloodPressure, rBloodPressure } = req.body;

            let record = new Records({
                hemoglobin,
                sugarLevel,
                rbcCount,
                wbcCount,
                lBloodPressure,
                rBloodPressure,
                user: req.user._id
            });

            await record.save();

            college = await College.findOne({userId:req.user._id});

            const user = await User.findByIdAndUpdate(req.user._id,{collegeId:college._id});

            res.status(200).send({
                success:true,
                message:"",
                data:college
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