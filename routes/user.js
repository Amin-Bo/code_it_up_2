
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/users');
const Association = require('../models/association');
///Controllers 
const mail=require('../mail/mail')
const AuthController = require('../controllers/authController');
const Auth = require('../middlwares/Auth');
const userController = require('../controllers/userController');
const founderController = require('../controllers/founderController');
const articleController = require('../controllers/articleController');
const Article = require('../models/article');
const multer = require('multer');
const path = require('path');
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/jpg': 'jpeg'
};
const storageEvents = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,path.join(__dirname,'../assets/articles'));
    },
    filename: function (req, file, cb) {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext= MIME_TYPE_MAP[file.mimetype];
        cb(null, Date.now()+ '-' +name);
    }
});
const storageLogo = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,path.join(__dirname,'../assets/logos'));
    },
    filename: function (req, file, cb) {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext= MIME_TYPE_MAP[file.mimetype];
        cb(null, Date.now()+ '-' +name);
    }
});
//Login
router.post('/login', AuthController.login);
//Registration
router.post('/register',multer({storage:storageLogo}).single("logo"), (req, res, next) => {
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
    if (req.file) {
        newUser.logo = req.file.filename;
    }
    let association = new Association({
        name: req.body.association,
        description: req.body.description,
        email: req.body.emailAssociation,
        founder: newUser._id,
    });
    if(req.file){
        association.logo = req.file.filename;
    }
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
                        message: err.message
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
});
router.post('/registerUser', AuthController.registerUser);

router.post('/apply/:id', Auth, userController.applyToAssociation);
router.get('/profile',Auth, userController.userProfile);
// founder routers
router.get('/getAppliedMembers', Auth, founderController.GetAppliedMember);
router.post('/memberStatus/:id', Auth, founderController.changeMemberStatus);
router.get('/article/get/:id', Auth, articleController.getArticleByAssociation);
router.get('/article/getById/:id',  articleController.getArticleById);
router.get('/data',Auth,founderController.test)
router.post('/article/add', Auth,multer({storage:storageEvents}).single("event_img"), (req, res, next) => {
    Association.find({founder:req.user._id},(err,association)=>{
        if(err) throw err;
  else{

      let newArticle = new Article()
      newArticle.title = req.body.title;
      newArticle.description = req.body.description;
      newArticle.file = req.file.filename;
      newArticle.association = association._id;
      newArticle.save((err, article) => {
          if (err) {
              res.status(500).send({
                  message: err.message
              });
          } else {
              res.status(200).send({
                  message: "Article added successfully",
                  article: article
              });
          }
      })
  }
    })
});
router.get('/members/:id', founderController.getMembers);
router.post('/follow/:id', Auth, userController.followAssociation);
module.exports = router;

