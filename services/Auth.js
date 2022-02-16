const fs = require('fs');
const path = require('path');

const crypto = require('crypto');

exports.validateSession = async function validateSession (req, res, next){
    try{
        if(req.method == "POST" && req.originalUrl == '/user/login'){
                next();
        }else{

                if(req.body.userID && req.body.sessionID){

                    const userID = await req.body.userID;
                    const sessionID = await req.body.sessionID;

                    const sessionFilePath = await path.join(__dirname, '..', 'sessions', userID + '.json');

                            await fs.readFile(sessionFilePath, async (err, data) => {
                                if(err != null && err.code == 'ENOENT'){
                                    return await res.status(403).json({ message: "Authentication failed"});
                                }
                                let sessionsJSON = await JSON.parse(data);
                                sessionsJSON = await sessionsJSON['sessionIDs'].filter( (item) => item.ID == sessionID);


                                if(sessionsJSON.length == 0){
                                    return await res.status(403).json({ message: "Authentication failed"});
                                }else{
                                    next();
                                }
                            });
                }else{
                    return res.status(403).json({ message: "Authentication failed"});;
                }

        }


    }catch(err){
        res.json({ message: "Authentication failed"});
    };
};

exports.hashPassword = async function hashPassword(password, salt){
    return crypto.createHmac('sha512', password).update(salt).digest('base64');
};