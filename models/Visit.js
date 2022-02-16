const mongoose = require('mongoose');

const VisitSchema = mongoose.Schema({
    date: { type: String, required: true },

    conclusion: { type: String },
    symptoms: { type: String },
    diagnosis: { type: String },
    prescriptions: { type: String },
    preparationForNextVisit: { type: String }
});



module.exports = VisitSchema;