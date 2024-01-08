const { User } = require('../models/user-model');
const jwt = require("jsonwebtoken");


exports.registrationMiddleware = async(req,res,next) => {
    try {
    
        const username = await User.findOne({username : req.body.username});
        const useremail = await User.findOne({email : req.body.email});

        if(!req.body.name){
            res.status(400).send("Name is not provided."); 
            return;
        }
        if(!req.body.username || username){ 
            res.status(400).send("Username is not provided or already taken.");
            return;
        }
        if(!req.body.email || useremail){  
            res.status(400).send("Email is not provided or already taken.");
            return;
        } 
        if(!req.body.password){
            res.status(400).send("Password is not provided.");
            return;
        }
        // if(!req.body.avatar){
        //     res.status(400).send("Avatar is not provided."); 
        //     return;
        // } 

        next();

    } catch (error) {
        console.log(`Error in registrationMiddleware : ${error}`);
    }
}


exports.verifyJwt = async(req,res,next) => {
    try {
        
        const token = req.cookies || req.header("Authorization").replace("Bearer ", "");

        console.log('here tokens ', token);

        if(!token){
            res.status(400).send({
                message : "Token is not expired or not valid" 
            });
        }

          const decodedInfo = jwt.verify(token.accessToken, process.env.SECRET);
          console.log('here decodedInfo', decodedInfo);

          const user = await User.findOne(decodedInfo.id);
          console.log(user ,'in middleware');

          if(!user){
            res.status(401).send({ 
                message  :  "not a valid token."
            }); 
          }

          req.username = user;
          next();

        } catch (error) {
        console.log("error in verifyJWT", error);
        return res.status(500).send(`error in verifyJWT middleware : ${error}`);
    }
      
}
