const mongoose = require('mongoose');

const PatientSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    mother:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    father:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    sibling:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    ]
});

module.exports = Patient = mongoose.model('patient',PatientSchema);

