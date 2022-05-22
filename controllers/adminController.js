const jwt = require('jsonwebtoken');
const User = require('../models/users');
const moment = require('moment');
const mail = require('../mail/mail');
const Association = require('../models/association');
exports.getAllAssociations = (req, res) => {
    Association.find({}, (err, associations) => {
        if (err) {
            res.status(500).send({
                message: err.message
            });
        } else {
            res.status(200).send(associations);
        }
    }).populate('founder', ['name', 'email', 'type'])
}
exports.getAssociationById = (req, res) => {
    Association.findById(req.params.id, (err, association) => {
        if (err) {
            res.status(500).send({
                message: err.message
            });
        } else {
            res.status(200).send({
                message: "Association list",
                association: association
            });
        }
    }).populate('founder', ['name', 'email', 'type']).populate('members.member')
}
exports.updateAssociationStatus = (req, res) => {
    Association.findByIdAndUpdate(req.params.id, {
        status: req.body.status
    }, (err, association) => {
        if (err) {
            res.status(500).send({
                message: err.message
            });
        } else {
            res.status(200).send({
                message: "Association status updated successfully",
                association: association
            });
        }
    })
}
exports.getMembers=(req,res)=>{
    Association.findById(req.user.association,(err,members)=>{
        if(err){
            res.status(500).send({
                message:err.message
            })
        }else{
            res.status(200).send({
                members
            })
        }
    }).populate('members.member')
}