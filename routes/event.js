
const express = require('express');
const router = express.Router();
const passport = require('passport');

///Controllers 
const AuthController = require('../controllers/authController');
const Auth = require('../middlwares/Auth');
const adminController= require('../controllers/adminController');
const eventController= require('../controllers/eventController');
const Article = require('../models/article');
const Event = require('../models/event');
const User = require('../models/users');
const mail=require('../mail/mail')
const multer = require('multer');
const path = require('path');
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};
const storageEvents = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,path.join(__dirname,'../assets/events'));
    },
    filename: function (req, file, cb) {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext= MIME_TYPE_MAP[file.mimetype];
        cb(null, Date.now()+ '-' +name);
    }
});
router.post('/event',Auth,multer({storage:storageEvents}).single("file"),(req,res,next)=>{
    let newEvent = new Event()
    newEvent.title = req.body.title;
    newEvent.date = req.body.date;
    newEvent.description = req.body.description;
    newEvent.file = req.file.filename;
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
                mail.sendNewsLetter(users,event)
            })
            res.status(200).send({
                message: "Article added successfully",
                event: event
            });
        }
    })
 } );
router.get('/eventByAssociation/:id',eventController.getEventByAssociation);
router.get('/event/:id',eventController.getEventById);
router.post('/participate/:id',Auth,eventController.participateToEvent);
router.get('/participated/:id',eventController.getParticipatedEvents);
module.exports = router;

