const mongoose = require('mongoose');

exports.dbConnect = async() => {
    mongoose.connect(process.env.MONGO);
    const db = mongoose.connection;
    db.on('error', (err) => {
        console.log(`Error while connecting db : ${err}`);
    });
    db.once('open', () => {
        console.log(`Connected to db suuccessfully.`);
    });
}