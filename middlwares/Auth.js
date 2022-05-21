const jwt = require('jsonwebtoken');
const Association = require('../models/association');

module.exports = (req, res, next) => {
  let token ="" ;
  let headers="";
  try {
     headers=req.headers.authorization;
     token =headers.split(' ')[1];
    const decodedToken = jwt.verify(token, 'tnDigital');
    const user = decodedToken.user;
    if (!user) {
      throw 'Invalid user ID';
    } else if(user.type!='founder') {
      req.user=user;
      next();
    }
    else{
      Association.find({founder:user._id},(err,association)=>{
        if(err)throw err
        else{
          if(association.length>0){
            req.user=user;
            req.user.association=association[0];
            next();
          }
          else{
            res.status(500).send({
              message:"You are not a founder of any association"
            })
          }
        }
      })
    }
  } catch (error) {
    res.status(401).json({
      error: error.message
    });
  }
};