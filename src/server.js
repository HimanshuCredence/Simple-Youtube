const express = require('express');
const { PORT } = require('./configs/server-config');
const { dbConnect } = require('./configs/db-config');
const cookieParser = require('cookie-parser');
const { route } = require('./routes/user-route');
const { User } = require('./models/user-model');

const app = express();

app.use(express.json({limit : '16kb'}));
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

dbConnect().then(() => { 
    dropUser(); 
    console.log(`dropped collection successfully`);
})

async function dropUser() {
    await User.collection.drop(); 
} 

route(app);

const serverConnect = (err) => {
   if(err){
       console.log(`Error while connecting server`); 
   }
   app.listen(PORT);
   console.log(`⚙️  Server is listening on port : ${PORT}`);
   
}
serverConnect();