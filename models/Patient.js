const mongoose = require('mongoose');

const VisitSchema = require('./Visit');

const PatientSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    pesel: { type: String, required: true },

    phoneNumber: { type: String, required: true },
    email: { type: String },

    homeAddress: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },

    description: { type: String },
    diseases: { type: String },
    allergies: { type: String },
    drugs: { type: String },

    visits: [VisitSchema],

    doctorID: { type: String,  required: true }

});

module.exports = mongoose.model('Patient', PatientSchema, 'patients');