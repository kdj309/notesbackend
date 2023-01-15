const mongoose = require('mongoose');
const { Schema } = mongoose
//using mongoose we can create schema for mongodb collection 
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password:{
        type:String,
        unique:true,
    },
    Date:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model("User",UserSchema)
//exporting mongoose models which accepts name of the schema and particular schema