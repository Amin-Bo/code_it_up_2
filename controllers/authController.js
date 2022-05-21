const jwt = require('jsonwebtoken');
const User = require('../models/users');
const moment = require('moment');
const mail = require('../mail/mail');
const Association = require('../models/association');
exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const query = {
        email
    }
    //Check the user exists
    User.findOne(query, (err, user) => {
        //Error during exuting the query
        if (err) {
            return res.send({
                success: false,
                message: 'Error, please try again'
            });
        }

        //No User match the search condition
        if (!user) {
            return res.send({
                success: false,
                message: 'Error, Account not found'
            });
        }

        //Check if the password is correct
        user.isPasswordMatch(password, user.password, (err, isMatch) => {

            //Invalid password
            if (!isMatch) {
                return res.status(400).send({
                    success: false,
                    message: 'Error, Invalid Password'
                });
            }

            //User is Valid

            const ONE_WEEK = 604800; //Token validtity in seconds

            //Generating the token
            const token = jwt.sign({
                user
            }, process.env.SECRET, {
                expiresIn: ONE_WEEK
            });
            // console.log(token)
            //console.log( jwt.decode(token))
            //User Is Valid
            //This object is just used to remove the password from the returned fields
            let returnUser = {
                name: user.name,
                email: user.email,
                id: user._id,
            }
            user.password = ""
            //Send the response back
            return res.status(200).send({
                success: true,
                message: 'You are logged in now',
                user,
                token
            });
        });

    });
}

exports.register = (req, res, next) => {
    let newUser = new User({
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
        cin: req.body.cin,
        adresse: req.body.adresse,
        type: req.body.type
    });
    let association = new Association({
        name: req.body.association,
        description: req.body.description,
        email: req.body.emailAssociation,
        logo: req.file.filename,
        founder: newUser._id,
    });
    const query = req.body.email;
    //Check the user exists
    User.findOne({
        email: req.body.email
    }, (err, user) => {
        //Error during exuting the query
        if (user) {
            return res.send({
                success: false,
                message: 'Error, User already exists'
            });
        } else {
            newUser.save((err, user) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Failed to save the user'
                    });
                } else {
                    association.save((err, association) => {
                        if (err) throw err;
                    })
                    res.send({
                        success: true,
                        message: 'User Saved',
                        user
                    });
                    mail.sendAfterRegister(req, res, next);
                }
            });
        }
    });
}
exports.registerUser = (req, res, next) => {
    let newUser = new User({
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
        cin: req.body.cin,
        adresse: req.body.adresse,

    });

    const query = req.body.email;
    //Check the user exists
    User.findOne({
        email: req.body.email
    }, (err, user) => {
        //Error during exuting the query
        if (user) {
            return res.send({
                success: false,
                message: 'Error, User already exists'
            });
        } else {
            newUser.save((err, user) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Failed to save the user'
                    });
                } else {

                    res.send({
                        success: true,
                        message: 'User Saved',
                        user
                    });
                }
            });
        }
    });
}