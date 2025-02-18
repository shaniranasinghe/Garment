const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema({
    code:{
        type:String,
        required:true,
    },
    colour:{
        type:String,
        required:true,
    },
    quantity:{
        type:String,
        required:true,
    },
    price:{
        type:String,
        required:true,
    },
    tot:{
        type:Number,
        
    },
});

module.exports = Stock = mongoose.model("stock", StockSchema);