const mongoose = require("mongoose");

const SubscriberSchema = new mongoose.Schema({
subscriber : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
},
channel : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
}
},{
    timestamps : true
})

exports.Subscriber = mongoose.model("subscriber", SubscriberSchema);