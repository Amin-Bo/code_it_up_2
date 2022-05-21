
const express = require('express');
const router = express.Router();
const passport = require('passport');

///Controllers 
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
    'image/jpg': 'jpg'
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
//Login
router.post('/login', AuthController.login);
//Registration
router.post('/register', AuthController.register);
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
    let newArticle = new Article()
    newArticle.title = req.body.title;
    newArticle.description = req.body.description;
    newArticle.file = req.file.filename;
    newArticle.association = req.user.association._id;
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
});
module.exports = router;

