const jwt = require("jsonwebtoken");

exports.accessToken = (user) =>{
    return jwt.sign({
        id : {
            username : user.username,
            email : user.email
        },
        name : user.name
    }, process.env.SECRET,{ 
        expiresIn : 600
    });
} 

exports.refreshToken = (user) => {
   return jwt.sign({ 
        id : {
            username : user.username,
            email : user.email
        },
        name : user.name
    }, process.env.SECRET,{
        expiresIn : 1500
    });
} 
