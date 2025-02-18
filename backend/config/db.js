const mongoose = require('mongoose');

const dburl = "mongodb+srv://shaniranasinghe2001:1234@cluster0.jv0rm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.set("strictQuery", true,"useNewUrlParser", true); 

const connection = async ()=>{
    try{
        await mongoose.connect(dburl);
        console.log("MongoDb connected");
    }catch(e){
        console.error(e.message);
        process.exit();
    }
};
module.exports = connection;