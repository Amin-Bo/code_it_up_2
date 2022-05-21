
const express = require('express');
const router = express.Router();

///Controllers 
const chatController = require('../controllers/chatController');
const Auth = require('../middlwares/Auth');


//create project
router.post('/chat/:messageId?/:id',Auth,chatController.SendMessage);
router.get('/:to',Auth,chatController.getMessages);



module.exports = router;

