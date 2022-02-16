const mongoose = require('mongoose');

const PlannedVisitSchema = mongoose.Schema({

    patientID: { type: String, required: true},

    patientFirstName: { type: String, required: true},

    patientLastName: { type: String, required: true},

    patientPesel: { type: String, required: true},

    date: { type: String, required: true },

    hour: { type: String, required: true }



});

module.exports = PlannedVisitSchema;