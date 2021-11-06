const mongoose = require('mongoose');

const RecordSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    hemoglobin:{
        type: Number
    },
    sugarLevel:{
        type: Number
    },
    rbcCount:{
        type: Number
    },
    wbcCount:{
        type: Number
    },
    lBloodPressure:{
        type: Number
    },
    hBloodPressure:{
        type: Number
    },
    Date:{
        type:Date,
        default: Date.now,
    },
    title:{
        type:String,
    },
    notes:{
        type:String,
    }

});

module.exports = Record = mongoose.model('record',RecordSchema);

