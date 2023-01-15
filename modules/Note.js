const mongoose = require('mongoose');
const { Schema } = mongoose
const User = require('./User');
//using mongoose we can create schema for mongodb collection 
const Noteschema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:User
    },
    Title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    Tags:{
        type:String,
        default:'general'
    },
    time:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model("Notes",Noteschema)
//exporting mongoose models which accepts name of the schema and particular schema