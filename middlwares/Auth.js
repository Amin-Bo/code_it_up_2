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
    } 
    else{
      req.user=user;
      Association.find({founder:req.user._id},(err,association)=>{
        if(err)throw err
        else{
          console.log(association)
          if(association.length>0){
            req.user.association=association[0];
            next();
          }
          else{
          next()
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