const mongoose = require('mongoose');

const MedicalInfoSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    bloodGroup:{
        type: String,
    },
    hasDiabetes:{
        type:Boolean,
        default:false
    },
    hasBloodPressureProblem:{
        type:Boolean,
        default:false,
    }    
});

module.exports = MedicalInfoSchema = mongoose.model('medicalInfo',MedicalInfoSchema);

