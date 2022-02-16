const mongoose = require('mongoose');

const PlannedVisitSchema = require('./PlannedVisit');

const UserSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },

    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true},

    plannedVisits: [PlannedVisitSchema]

});

module.exports = mongoose.model('User', UserSchema, 'users');