if(process.env.NODE_ENV !== "development"){
    require('dotenv').config();
}

exports.PORT = process.env.PORT;