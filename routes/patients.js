const express = require('express');

const router = express.Router();

const PatientsController = require('../controllers/PatientsController');


router.post('/getPatient', PatientsController.getPatient);

router.post('/getAllPatients', PatientsController.getAllPatients);

router.post('/createPatient', PatientsController.createPatient);

router.delete('/deletePatient', PatientsController.deletePatient);

router.put('/changePatientData', PatientsController.changePatientData);

router.put('/changePatientVisitData', PatientsController.changePatientVisitData);

router.post('/addCompletedVisit', PatientsController.addCompletedVisit);

router.post('/getPatientVisitData', PatientsController.getPatientVisitData);

module.exports = router;