const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('dotenv/config');

const userRoutes = require('./routes/user');
const patientsRoutes = require('./routes/patients');

const auth = require('./services/Auth');

const crypto = require('crypto');


mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true },  () => console.log('DB connected'));

const app = express();
const port = process.env.PORT || 80;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use( (req, res, next) => {auth.validateSession(req, res, next)});

app.use('/user', userRoutes);

app.use('/patients', patientsRoutes);


app.listen( port, () => {
     console.log("Server started");
});