const express = require('express');
//importing the express pacakage
const dbconnect=require('./db');
//importing database connection function to call it in main file
var cookieParser = require('cookie-parser');
const app = express()
var cors = require('cors');
const  path  = require('path')
require('dotenv').config()
app.use(cors())
app.use(cookieParser());
//initializing the app
dbconnect.dbconnect()
//calling databse connection method
app.use(express.json())
//to use json as content type for request body allowing json 
app.get('/', (req, res) => {
    res.send("Hello server started")
})

//testing the server connection
app.use('/api/user',require('./routes/user'))
//using routes we can make individual routes for different purpose and we call it main file using app.use and providing file location
app.use('/api/notes',require('./routes/NotesInsert'))
app.listen(process.env.PORT || 3001,()=>{
    console.log("server running")
})
//making server at 3001 port number