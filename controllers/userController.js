const jwt = require('jsonwebtoken');
const User = require('../models/users');
const moment = require('moment');
const mail = require('../mail/mail');
const Association = require('../models/association');
exports.applyToAssociation = (req, res, next) => {
    let member = {
        member: req.user,
        status: 'pending'

    }
    Association.findByIdAndUpdate(req.params.id, {
        $push: {
            members: member,
        }
    }, (err, chat) => {
        if (err) {
            res.status(500).send({
                message: err.message
            });
        } else {

            res.status(200).send({
                message: "applied  successfully wait for the admin to accept you",
            });
        }

    })
}