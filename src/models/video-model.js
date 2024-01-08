const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
videofile : {
    type : String,
    required : true
},
thumbnail : {
    type : String,
    required : true
},
title : {
    type : String,
    required : true
},
description : {
    type : String,
    required : true
},
duration : {
    type : Number,
    required : true
},
views : {
    type : Number,
    default : 0
},
ispublish : {
    type : boolean,
    default : true
},
owner : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
}
},
{
timestamps : true
});


exports.Video = mongoose.model("Video", videoSchema);