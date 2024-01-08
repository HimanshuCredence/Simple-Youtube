const { User } = require('../models/user-model');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");


exports.userRegister = async(req,res) => {
    try {
        const userObj = {
            name : req.body.name,
            username : req.body.username,
            email : req.body.email,
            avatar : toString(req.body.avatar),
            coverimage : req.body.coverimage,
            password : bcrypt.hashSync(req.body.password,8)
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
            coverimage : createUser.coverimage   
        }
        res.status(201).send(response);
    } catch (error) {
        console.log(`error in user registration ${error}`);
    }
}

exports.userAuthentication = async(req,res) => {
    try {

        const {username, email} = req.body;

        const user = await User.findOne({$or : [{username: username},{email : email}]});

        if(!user){
            res.status(400).send({message : "Email or Username is not registered."});
        }

        const validPass = bcrypt.compareSync(req.body.password, user.password);

        if(!validPass){
            res.status(400).send({message : "Password is incorrect."});
        } 

        const accessToken = jwt.sign({
            id : {
                username : user.username,
                email : user.email
            },
            name : user.name
        }, process.env.SECRET,{ 
            expiresIn : 600
        });

        const refreshToken = jwt.sign({
            id : {
                username : user.username,
                email : user.email
            },
            name : user.name
        }, process.env.SECRET,{
            expiresIn : 1500
        });

        const response = {
            name : user.name,
            username : user.username,
            email : user.email,
            avatar : req.files, 
            coverimage : user.coverimage,
            accessToken : accessToken,
            refreshToken  : refreshToken
        }

        const options = {
            httpOnly : true,
            secure : true
        }
        
        // res.status(201).send(response);

        res.status(201)
        .cookie("accessToken",accessToken, options)
        .cookie("refreshToken",refreshToken, options)
        .send(response)
        
    } catch (error) {
        console.log(`error in user authentication ${error}`);
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
        res.status(500).send(error)
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
    res.status(500).send({message : error})
 }
}
 
exports.userDelete = async(req,res) => {
    try {
        
        await User.deleteOne({username : req.params.username});

        res.status(200).send({message : `User deleted successfully.`})
        
    } catch (error) {
        console.log('error in userDelete() :', error);
        res.status(500).send({message : error})
    }
}

exports.refreshAccessToken = async(req,res) => {
    try {
        
        const token = req.cookies.refreshToken 

    } catch (error) {
        console.log(`Error in refreshAccessToken : ${error}`);
    }
}