const express = require('express');
const User = require('../modules/User');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const routes = express.Router();
const { body, validationResult, check } = require('express-validator');
const Fetchuser = require('../middleware/fetchUser');
require('dotenv').config()
const jwtkey = 'Kdj@309'
let userpassword
let userid
//creating route for signup route 1
routes.post('/createUser', check('password').isLength({ min: 5 }).withMessage('must be at least 5 chars long').matches(/\d/), check('email').isEmail().custom(value => {
    //we can validate by our own logic ex:validating same User with one email exists or not using findOne method og mongodb whicj returns the Collectionrow if it finds otherwise null based n that we can reject the promise
    return User.findOne({ email: value }).then((user) => {
        //console.log(user)
        if (user) {
            return Promise.reject('E-mail already in use');
        }
    })
}), async (req, res) => {
    //console.log(req.body)
    //res.send(" login Api is called");


    //jwt signature is assigned 
    const payload = { id: req.body.id }
    //payload is created when user request the page
    var token = jwt.sign(payload, jwtkey);
    //Unique token is created for each time user sends request 
    var salt = await bcrypt.genSalt(10);
    //salt is generated which will be added to hash of the password for extra protection 
    var hash = await bcrypt.hash(req.body.password, salt);
    //password hash is created in this step using salt and password
    const errors = validationResult(req);
    //validationResult returns the array of errors if any error occurred
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } else {
        const user = new User({ ...req.body, "password": hash });
        //if there is no error a New user is created and saved into the database
        await user.save();
        return res.status(200).send(token)
        //we authentication token for particular user is passed to user response but generally it passsed into browser cookie 
    }

})
//creating route for login route 2
routes.post('/Userlogin', body('password').exists(), check('email').isEmail().custom(value => {
    //we can validate by our own logic ex:validating same User with one email exists or not using findOne method og mongodb whicj returns the Collectionrow if it finds otherwise null based n that we can reject the promise
    return User.findOne({ email: value }).then((user) => {
        //console.log(user)

        if (user == null) {
            return Promise.reject('E-mail is not registered');
        } else {
            userpassword = user.password
            userid = user.id
        }
    })
}), async (req, res) => {
    //res.send(" login Api is called");

    var token = jwt.sign({ id: userid }, jwtkey);
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } else {
            //bcrypt
            bcrypt.compare(req.body.password, userpassword, function (err, result) {
                if (result) {
                    return res.status(200).send(token)
                } else {
                    return res.status(400).send("please enter valid credentials")
                }
            });
        }
    } catch (error) {
        return res.status(500).send("Some internal error occured")
    }


})
//routes for getting user details route 3
routes.get('/getuser', Fetchuser, async (req, res) => {
    //res.send(" login Api is called");

    try {
        const id = req.id
        //console.log(id)
        const user = await User.findById(id).select("-password")
        //console.log(user)
        return res.status(200).send(user)
    } catch (error) {
        return res.status(500).send("Some internal error occured")
    }


})
module.exports = routes