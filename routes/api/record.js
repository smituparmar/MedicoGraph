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

// @route   GET api/record
// @desc    get user's record information
// @access   Private
router.get('/:id',auth,async (req,res)=>{
    try{
        const {id} = req.params
        const record = await Records.findById(id);
        // req.io.emit("message","Hey!")
        return res.status(200).send({
            success:true,
            message:"",
            data:record
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
        check('hBloodPressure','hBloodPressure is required').exists(),
        check('title','title is required').exists(),
        check('notes','notes is required').exists(),
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

            const { hemoglobin, sugarLevel, rbcCount, wbcCount, lBloodPressure, hBloodPressure, title, notes } = req.body;

            let record = new Records({
                hemoglobin,
                sugarLevel,
                rbcCount,
                wbcCount,
                lBloodPressure,
                hBloodPressure,
                title,
                notes,
                user: req.user._id
            });

            const newRecord = await record.save();

            res.status(200).send({
                success:true,
                message:"",
                data:newRecord
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

// @route   PUT api/record/update
// @desc    update user's college
// @access   Private
router.put('/update',[
    auth,
    [
        check('id','ID of Record is required').exists()
    ]],
    async (req,res) => {

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
        try {
            const { id, hemoglobin, hBloodPressure, lBloodPressure, rbcCount, wbcCount, title, notes } = req.body;
            
            const record = await Records.findById(id);

            const updateRecordBody = {
                hemoglobin: hemoglobin ? hemoglobin : record.hemoglobin,
                hBloodPressure: hBloodPressure ? hBloodPressure : record.hBloodPressure,
                lBloodPressure: lBloodPressure ? lBloodPressure : record.lBloodPressure, 
                rbcCount: rbcCount ? rbcCount : record.rbcCount, 
                wbcCount: wbcCount ? wbcCount : record.wbcCount,
                title: title ? title : record.title,
                notes: notes ? notes : record.notess,
                user: req.user.id
            };

            await Records.findByIdAndUpdate(id,updateRecordBody);
            
            const updatedRecord = await Records.findById(id);

            res.status(200).send({
                success:true,
                message:"",
                data:updatedRecord
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

// @route   DELETE api/college/delete
// @desc    delete user's college
// @access   Private
router.delete('/delete',[
    auth,[
        check('id','Id of Record is required').exists()
    ]
],
async (req,res) => {
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
    try {
        const {id} = req.body;

        const record =await Records.findByIdAndRemove(id);
        
        res.status(200).send({
            success:true,
            message:"",
            data:record
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:error.message,
            data:""
        });
    }

})
module.exports = router;