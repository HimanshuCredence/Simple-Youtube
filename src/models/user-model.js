const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
username : {
    type : String,
    required : true,
    lowercase : true,
    index : true,
    unique : true,
    trim : true
},
email : {
    type : String,
    required : true,
    lowercase : true,
    unique : true,
    trim : true,
    minlength : 4
},
name : {
    type : String,
    required : true,
    index : true,
    trim : true
},
avatar : {
    type : String,
    required : true
},
coverimage : {
    type : String,
},
watchHistory : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Video"
},
password : {
    type : String,
    required : [true, 'password is required'],
    minlength : 4
},
refreshToken : {
    type : String
}
},
{
    timestamps : true
});

exports.User = mongoose.model("User", userSchema); 