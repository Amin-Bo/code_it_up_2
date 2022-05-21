const Chat = require("../models/chat");
exports.SendMessage = (req, res) => {
    let newChat = new Chat()
    let messages = {
        from: req.user._id,
        to: req.params.id,
        message: req.body.message,
    };
    newChat.messages.push({
        from: messages.from,
        to: messages.to,
        message: messages.message,
    });

    if (req.params.messageId == null) {

        Chat.create(newChat, (err, chat) => {
            if (err) {
                res.status(500).send({
                    message: err.message
                });
            } else {

                res.status(200).send({
                    message: "Message sent successfully",
                    chat: chat
                });
            }

        })
    } else {

        Chat.findByIdAndUpdate(req.params.messageId, {
            $push: {
                messages: messages
            }
        }, (err, chat) => {
            if (err) {
                res.status(500).send({
                    message: err.message
                });
            } else {

                res.status(200).send({
                    message: "Message sent successfully",
                    chat: chat
                });
            }

        })
    }
}
exports.getMessages = (req, res) => {
    Chat.find({
      
                "messages.from": req.user._id,
                "messages.to": req.params.to
            },
          
        
     {
        "messages.message": 1,
        'messages.from': 1,
        _id: 0
    }, (err, chat) => {
        if (err) {
            res.status(500).send({
                message: err.message
            });
        } else {
            res.status(200).send({
                message: "Messages fetched successfully",
                chat: chat
            });
        }
    })
}