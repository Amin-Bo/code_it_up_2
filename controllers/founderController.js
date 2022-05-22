const jwt = require('jsonwebtoken');
const User = require('../models/users');
const moment = require('moment');
const mail = require('../mail/mail');
const Association = require('../models/association');
exports.GetAppliedMember = (req, res, next) => {
    let pendingUser=[];
    Association.find({
        founder: req.user,
        },{members:1},
        (err, members) => {
            if (err) {
                res.status(500).send({
                    message: err.message
                });
            } else {
                members.forEach(member => {
                    member.members.forEach(member => {
                        if (member.status == "pending") {
                            pendingUser.push(member)
                        }
                    });
                });
                res.status(200).send({
                    pendingUser
                });
            }
            return res.json(pendingUser)
        }).populate('members.member')

}
exports.changeMemberStatus = (req, res, next) => {
    Association.findOneAndUpdate({"members.member":req.params.id}, {
        $set: {
            "members.$.status": req.body.status
        }
    }, (err, chat) => {
        if (err) {
            res.status(500).send({
                message: err.message
            });
        } else {

            res.status(200).send({
                message: "status changed successfully",
            });
        }

    })
}
exports.getMembers=(req,res)=>{
    Association.findById(req.params.id,(err,members)=>{
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
exports.test = (req, res, next) => {
    return res.json(req.user)
}