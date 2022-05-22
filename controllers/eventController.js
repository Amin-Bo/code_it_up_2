const Article = require('../models/article');
const multer = require('multer');
const Event = require('../models/event');
const mail = require('../mail/mail');
const path = require('path');
const User = require('../models/users');
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};
const storageEvents = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'assets'));
    },
    filename: function (req, file, cb) {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, Date.now() + '-' + name);
    }
});
exports.addEvent = (req, res) => {
    let newEvent = new Event()
    newEvent.title = req.body.title;
    newEvent.description = req.body.description;
    newEvent.file = req.body.file;
    newEvent.association = req.user.association._id;
    newEvent.save((err, event) => {
        if (err) {
            res.status(500).send({
                message: err.message
            });
        } else {
            User.find({
                following: event.association
            },(err,users)=>{
                console.log(users)
            })
            res.status(200).send({
                message: "Article added successfully",
                event: event
            });
        }
    })
}
exports.getEventByAssociation = (req, res) => {
    Event.find({
        association: req.params.id
    }, (err, event) => {
        if (err) {
            res.status(500).send({
                message: err.message
            });
        } else {
            res.status(200).send({
                message: "Article list",
                event
            });
        }
    }).populate('association')
}
exports.getEventById = (req, res) => {
    Event.findById(req.params.id, (err, event) => {
        if (err) {
            res.status(500).send({
                message: err.message
            });
        } else {
            res.status(200).send({
                message: "Article list",
                event: event
            });
        }
    }).populate('association', ['name', 'description', 'founder'])
}
exports.participateToEvent = (req, res) => {

    Event.findOneAndUpdate({
        _id: req.params.id
    }, {
        $push: {
            participants: {

                participant:req.user._id
            }
        }
    }, (err, event) => {

        if (err) {
            res.status(500).send({
                message: err.message
            });
        } else {
            res.status(200).send({
                message: "Article added successfully",
                event: event
            });
        }
    })
}
exports.getParticipatedEvents = (req, res) => {
    Event.find({
        _id: req.params.id
    }, (err, events) => {
        if (err) {
            res.status(500).send({
                message: err.message
            });
        } else {
            res.status(200).send({
                events: events
            });
        }
    }).populate('participants.participant', ['firstName','lastName', 'email'])
}