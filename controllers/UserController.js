const User = require('../models/User');

const Patient = require('../models/Patient');

const PlannedVisit = require('../models/PlannedVisit');

const mongoose = require('mongoose');

const fs = require('fs');

const path = require('path');

const crypto = require('crypto');

const auth = require('../services/Auth');


exports.login = async (req, res) => {
    try{

    const foundUser = await User.findOne({
        email: req.body.userEmail,
    });

    if(foundUser == null){
        return await res.status(401).json({ message: "Login failed" });
    }

    const hashedPassword = await auth.hashPassword(req.body.userPassword, foundUser.salt);

    const buf = await crypto.randomBytes(128).toString('base64');
    if(foundUser._id && crypto.timingSafeEqual(Buffer.from(hashedPassword, 'utf-8'), Buffer.from(foundUser.password, 'utf-8'))){
        const sessionFilePath = await path.join(__dirname, '..', 'sessions', foundUser._id + '.json');

        await fs.access(sessionFilePath, async (err) => {
            if(err){
                await fs.appendFile(sessionFilePath, JSON.stringify({ sessionIDs: [{ ID: buf }]}, null, 4), (err) => {console.log('Session file created')});
            }
            else{
                await fs.readFile(sessionFilePath, async (err, data) => {
                    let sessionsJSON = await JSON.parse(data);
                    await sessionsJSON['sessionIDs'].push({ ID: buf });
                    await fs.writeFile(sessionFilePath, JSON.stringify(sessionsJSON, null, 4), (err) => {console.log('New session added')});
                });
            }
    });
        await res.status(200).json({
            sessionID: buf,
            userID: foundUser._id,
            firstName: foundUser.firstName,
            lastName: foundUser.lastName,
            email: foundUser.email

        });
    }else{
        await res.status(401).json({ message: "Login failed" });
    }

    } catch(err){
        await res.status(401).json({ message: "Login failed" });
    }
};

exports.logout = async (req, res) => {
    try{
        const userID = await req.body.userID;
        const sessionID = await req.body.sessionID;

        const sessionFilePath = await path.join(__dirname, '..', 'sessions', userID + '.json');


        await fs.access(sessionFilePath, async (err) => {
            await fs.readFile(sessionFilePath, async (err, data) => {
                let sessionsJSON = await JSON.parse(data);
                let newSessionsJSON = await sessionsJSON['sessionIDs'].filter( (item) => item.ID != sessionID);
                await fs.writeFile(sessionFilePath, JSON.stringify({ sessionIDs: newSessionsJSON}, null, 4), (err) => {console.log('')});
                return await res.json({ message: "Logout succeeded"});
        });
        if(err){
            return await res.json({ message: "Logout failed" });
        }
    });

    }
    catch(err){
        await res.json({ message: "Logout failed" });
    }


};

exports.sendUserData = async (req, res) => {
    try{
        const foundUser = await User.findOne({
            _id: req.body.userID
        });

        await res.status(200).json({
            firstName: foundUser.firstName,
            lastName: foundUser.lastName,
            email: foundUser.email

        });
    }catch(err){
        await res.status(403).json({
            message: "Could not find a user"
        })
    };
};


exports.getPlannedVisits = async (req, res) => {
    try{
        const foundPlannedVisits = await User.findOne({
            _id: req.body.userID
        }, 'plannedVisits');

        await res.status(200).json(foundPlannedVisits);


    }catch(err){
        await res.json({ message: "Could not find planned visits" });
    }

};

exports.addPlannedVisit = async (req, res) => {
    try{

        if(!req.body.patientID || !req.body.date || !req.body.hour){
            return res.status(403).json({ message: 'Adding planned visit failed - data cannot be empty'});
        }

        const foundPatient = await Patient.findOne({ _id: req.body.patientID });

        const plannedVisit = {
            patientID: req.body.patientID,

            patientFirstName: foundPatient.firstName,
            patientLastName: foundPatient.lastName,
            patientPesel: foundPatient.pesel,

            date: req.body.date,
            hour: req.body.hour
        };

        await User.updateOne( { _id: req.body.userID }, { $push: { plannedVisits: plannedVisit } });
        await res.status(200).json({ message: "Planned visit added" });
    }catch(err){
        await res.status(403).json({ message: "Could not add planned visit" });
    }
};



exports.deletePlannedVisit = async (req, res) => {
    try{
        const plannedVisit = {
            visitID: req.body.visitID,
            date: req.body.date,
            hour: req.body.hour
        };
        await User.updateOne( { _id: req.body.userID }, { $pull: { plannedVisits: { _id: req.body.visitID } } });
        await res.status(200).json({ plannedVisit });
    }catch(err){
        await res.json({ message: err });
    }
    };