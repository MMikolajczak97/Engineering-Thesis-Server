const Patient = require('../models/Patient');

const User = require('../models/User');

exports.getPatient = async (req, res) => {
    try{
        const patient = await Patient.findOne({ _id: req.body.patientID, doctorID: req.body.userID });

        await res.status(200).json(patient);
    }
    catch(err){
        await res.json({ message: err });
    }
};

exports.getAllPatients = async (req, res) => {
    try{
        const patients = await Patient.find({ doctorID: req.body.userID });

        await res.status(200).json(patients);
    }
    catch(err){
        await res.json({ message: err });
    }
};

exports.createPatient = async (req, res) => {
    try{
        if(!req.body.firstName || !req.body.lastName || !req.body.pesel || !req.body.phoneNumber || !req.body.homeAddress || !req.body.city || !req.body.postalCode){
            return res.status(403).json({ message: 'Patient creation failed - personal data cannot be empty'});
        }

        const patient = await new Patient({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            pesel: req.body.pesel,

            phoneNumber: req.body.phoneNumber,
            email: req.body.email,

            homeAddress: req.body.homeAddress,
            city: req.body.city,
            postalCode: req.body.postalCode,

            description: "",
            diseases: "",
            allergies: "",
            drugs: "",

            visits: [],

            doctorID: req.body.userID
        });


        await patient.save();
        await res.status(200).json({ message: "Patient created" });
    }
    catch(err){
        await res.status(403).json({ message: "Patient creation failed" });
    }
};


exports.deletePatient = async (req, res) => {
    try{
        await Patient.deleteOne({ _id: req.body.patientID, doctorID: req.body.userID });
        await res.json({ message: 'Patient deleted' });
    }catch(err){
        await res.json({ message: err });
    }
};

exports.changePatientData = async (req, res) => {
    try{

        const changedData = {};

        if(req.body.firstName) changedData.firstName = req.body.firstName;
        if(req.body.lastName) changedData.lastName = req.body.lastName;
        if(req.body.pesel) changedData.pesel = req.body.pesel;

        if(req.body.phoneNumber) changedData.phoneNumber = req.body.phoneNumber;

        if(req.body.homeAddress) changedData.homeAddress = req.body.homeAddress;
        if(req.body.city) changedData.city = req.body.city;
        if(req.body.postalCode) changedData.postalCode = req.body.postalCode;

        changedData.email = req.body.email;

        changedData.description = req.body.description;
        changedData.diseases = req.body.diseases;
        changedData.allergies = req.body.allergies;
        changedData.drugs = req.body.drugs;

        await Patient.updateOne( { _id: req.body.patientID }, { $set: changedData });
        return await res.status(200).json({ message: "Patient data changed" });
    }catch(err){
        await res.status(403).json({ message: 'Could not change patient data' });
    }
};


exports.getPatientVisitData = async (req, res) => {
    try{

        const patientVisit = await Patient.findOne({ _id: req.body.patientID },
            { visits: { $elemMatch: { _id: {$eq: req.body.visitID} }}});

        return await res.status(200).json(patientVisit.visits[0]);


    }catch(err){
        await res.status(403).json({ message: 'Could not get completed visit data' });
    }
};

exports.changePatientVisitData = async (req, res) => {
    try{

        const changedData = {};

        changedData['visits.$.conclusion'] = req.body.conclusion;
        changedData['visits.$.symptoms'] = req.body.symptoms;
        changedData['visits.$.diagnosis'] = req.body.diagnosis;
        changedData['visits.$.prescriptions'] = req.body.prescriptions;
        changedData['visits.$.preparationForNextVisit'] = req.body.preparationForNextVisit;


        await Patient.updateOne({ _id: req.body.patientID, "visits._id": req.body.visitID },
            { $set: changedData });
        await res.status(200).json({ message: 'Patient visit data changed' });
    }catch(err){
        await res.status(403).json({ message: 'Could not change completed visit data' });
    }
};

exports.addCompletedVisit = async (req, res) => {
    try{
        const userVisit = await User.findOne({ _id: req.body.userID },
            { plannedVisits: { $elemMatch: { _id: {$eq: req.body.visitID} }}});

        const completedVisit = {
            date: userVisit.plannedVisits[0].date,
            conclusion: "",
            symptoms: "",
            diagnosis: "",
            prescriptions: "",
            preparationForNextVisit: ""
        };

        await Patient.updateOne( { _id: userVisit.plannedVisits[0].patientID }, { $push: { visits: completedVisit } });

        await User.updateOne( { _id: req.body.userID }, { $pull: { plannedVisits: { _id: req.body.visitID } } });

        await res.status(200).json({ message: 'Completed visit added' });

    }catch(err){
        await res.status(403).json({ message: "Could not add completed visit" });
    };

};

