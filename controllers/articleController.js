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
        cb(null,path.join(__dirname,'assets'));
    },
    filename: function (req, file, cb) {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext= MIME_TYPE_MAP[file.mimetype];
        cb(null, Date.now()+ '-' +name);
    }
});
exports.addArticle = (req, res) => {
    let newArticle = new Article()
    newArticle.title = req.body.title;
    newArticle.description = req.body.description;
    newArticle.file = req.body.file;
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
}
exports.getArticleByAssociation = (req, res) => {
    Article.find({
        association: req.params.id
    }, (err, articles) => {
        if (err) {
            res.status(500).send({
                message: err.message
            });
        } else {
            res.status(200).send({
                message: "Article list",
                articles: articles
            });
        }
    }).populate('association')
}
exports.getArticleById = (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        if (err) {
            res.status(500).send({
                message: err.message
            });
        } else {
            res.status(200).send({
                message: "Article list",
                article: article
            });
        }
    }).populate('association',['name','description','founder'])
}
// exports.getMessages = (req, res) => {
//     Chat.find({
      
//                 "messages.from": req.user._id,
//                 "messages.to": req.params.to
//             },
          
        
//      {
//         "messages.message": 1,
//         'messages.from': 1,
//         _id: 0
//     }, (err, chat) => {
//         if (err) {
//             res.status(500).send({
//                 message: err.message
//             });
//         } else {
//             res.status(200).send({
//                 message: "Messages fetched successfully",
//                 chat: chat
//             });
//         }
//     })
// }
