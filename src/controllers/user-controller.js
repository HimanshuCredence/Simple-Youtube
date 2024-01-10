const { User } = require('../models/user-model');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { refreshTokens, accessTokens } = require('../utils/token-generation');


exports.userRegister = async(req,res) => {
    try {
        const userObj = {
            name : req.body.name,
            username : req.body.username,
            email : req.body.email,
            avatar : toString(req.body.avatar),
            coverimage : req.body.coverimage,
            password : bcrypt.hashSync(req.body.password,8),

        }
        console.log('look Here userObj in registration',{
            name : req.body.name,
            username : req.body.username,
            email : req.body.email, 
            avatar : req.files, 
            coverimage : req.body.coverimage, 
            password : bcrypt.hashSync(req.body.password,8)
        });
        const createUser = await User.create(userObj);

        const response = {
            name : createUser.name,
            username : createUser.username,
            email : createUser.email,
            avatar : req.files, 
            coverimage : createUser.coverimage ,
            
        }
        res.status(201).send(response);
    } catch (error) {
        console.log(`error in userRegister() : ${error}`);
        return res.status(500).send({
            messgae : `error in userRegister() : ${error}`
        });
    }
}

exports.userAuthentication = async(req,res) => {
    try {

        const {username, email} = req.body;

        const user = await User.findOne({$or : [{username: username},{email : email}]});

        if(!user){
            return res.status(400).send({message : "Email or Username is not registered."});
        }

        const validPass = bcrypt.compareSync(req.body.password, user.password);

        if(!validPass){
            return res.status(400).send({message : "Password is incorrect."});
        } 


        const response = {
            name : user.name,
            username : user.username,
            email : user.email,
            avatar : req.files, 
            coverimage : user.coverimage,
            accessToken :  accessTokens(user),
            refreshToken  : refreshTokens(user)
        }

        const options = {
            httpOnly : true,
            secure : true
        }
        
        // res.status(201).send(response);
        
        // we are saving refresh token in db
        user.accessToken = response.accessToken;
        user.refreshToken = response.refreshToken;
        
        await user.save();

        console.log('user test', user);

        res.status(201)
        .cookie("accessToken",accessTokens(user), options)
        .cookie("refreshToken",refreshTokens(user), options)
        .send(response)
        
    } catch (error) {
        console.log(`error in userAuthentication() :  ${error}`);
        return res.status(500).send({
            messgae : `error in userAuthentication() : ${error}`
        });
    }
}

exports.userUpdate = async(req,res) => {
    try {

        const user = await User.findOne({username : req.params.username});

        user.name = req.body.name ? req.body.name : user.name;
        user.email = req.body.email ? req.body.email : user.email;
        user.password = req.body.password ? bcrypt.hashSync(req.body.password,8) : user.password;
        user.coverimage = req.body.coverimage ? req.body.coverimage : user.coverimage;
        user.avatar = req.body.avatar ? req.body.avatar : user.avatar;

        await user.save();

        const response = { 
            name : user.name,
            username : user.username, 
            email : user.email,
            avatar : req.files, 
            coverimage : user.coverimage
        }
        
        res.status(201).send(response);

    } catch (error) {
        console.log('error in userUpdate() :', error);
        return res.status(500).send({
            messgae : `error in userUpdate() : ${error}`
        });
    }
}


exports.logoutUser = async(req, res) => {
 try {
       // await User.findByIdAndUpdate(
       //     req.username,
       //     {
       //         $set: {
       //             refreshToken: undefined
       //         }
       //     },
       //     {
       //         new: true
       //     }
       // )
   
       const user = await User.findOne(req.username);
   
       user.refreshToken = undefined;
       await user.save();
   
       const options = {
           httpOnly: true,
           secure: true
       }
   
       console.log('in logout()',user);
   
       res
       .status(200)
       .clearCookie("accessToken", options)
       .clearCookie("refreshToken", options)
       .send({message : "User logged Out"})

 } catch (error) {
    console.log('error in logoutUser() :', error);
    return res.status(500).send({
        messgae : `error in logoutUser() : ${error}`
    });
 }
}
 
exports.userDelete = async(req,res) => {
    try {
        
        await User.deleteOne({username : req.params.username});

        res.status(200).send({message : `User deleted successfully.`})
        
    } catch (error) {
        console.log('error in userDelete() :', error);
        return res.status(500).send({
            messgae : `error in userDelete() : ${error}`
        });
    }
}

exports.refreshAccessToken = async(req,res) => {
    try {
        
        const token = req.cookies || req.body.refreshToken;

        console.log('meh', token);
        if(!token){
            return res.status(401).send({
                message : "Unauthorized request, access token required."
            });
        }

        const decodedInfo = jwt.verify(token.refreshToken, process.env.SECRET);
        
        const user = await User.findOne(decodedInfo.id);
        console.log('meow',user,user.refreshToken); 


        if(!user){
            return res.status(400).send({
                message : "Invalid User."
            });
        }

        if(token.refreshToken !== user.refreshToken){
            return res.status(500).send({message : "Provided token does not seem right, please check again"});
        }
 
        const options = {
            httpOnly: true,
            secure: true
        }


        res.status(201)
        .cookie("accessToken",accessTokens(user),options)
        .cookie("refreshToken",refreshTokens(user),options)
        .send({
            accessToken : accessTokens(user),
            refreshToken : refreshTokens(user),
            message : "Access tokens refreshed successfully."
        })

    } catch (error) {
        console.log(`Error in refreshAccessToken() : ${error}`);
        return res.status(500).send({
            messgae : `error in refreshAccessToken() : ${error}`
        });
    }
}