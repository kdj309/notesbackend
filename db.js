const mongoose = require('mongoose');
require('dotenv').config()
//importing mongoose library which is used to ease the databse related work by providing built in methods such as schema
const mongoUri = "mongodb+srv://kdj:6r1Rh9ijEdKurIVS@cluster0.f6cok.mongodb.net/?retryWrites=true&w=majority";
//unique string of the localhost mongodb databse
const dbconnect = () => {
    mongoose.connect(mongoUri, () => {
        console.log("connected to database");
    })
}
//function to connect to mongodb database which accepts uri and callback function
module.exports = { dbconnect }
//exporting dbconnect function