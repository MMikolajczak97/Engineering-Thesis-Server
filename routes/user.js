const express = require('express');

const router = express.Router();

const UserController = require('../controllers/UserController');


router.post('/login', UserController.login);

router.post('/logout', UserController.logout);

router.post('/addPlannedVisit', UserController.addPlannedVisit);

router.delete('/deletePlannedVisit', UserController.deletePlannedVisit);

router.post('/validateSession', UserController.sendUserData);

router.post('/getPlannedVisits', UserController.getPlannedVisits);


module.exports = router;