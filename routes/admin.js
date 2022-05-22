
const express = require('express');
const router = express.Router();
const passport = require('passport');

///Controllers 
const AuthController = require('../controllers/authController');
const Auth = require('../middlwares/Auth');
const adminController= require('../controllers/adminController');
const Article = require('../models/article');

router.get('/getAllAssociations', adminController.getAllAssociations);
router.get('/getAssociationById/:id', adminController.getAssociationById);
router.post('/updateAssociationStatus/:id', adminController.updateAssociationStatus);
router.get('/myMembers', Auth, adminController.getMembers);
router.get('/associations', Auth, adminController.CountAssociations);
router.get('/users', Auth, adminController.CountMembers);
router.get('/events', Auth, adminController.getEventsStats);
module.exports = router;

