const express = require('express');
const Note = require('../modules/Note');
const Fetchuser = require('../middleware/fetchUser');
//importing mongoose mdel 
const { body, validationResult, check } = require('express-validator');
//importing express validator methods
const routes = express.Router();
//initializing the express Router
routes.post('/insertnote', check('Title').isLength({ min: 5 }).withMessage('must be at least 5 chars long'), Fetchuser, async (req, res) => {
  //making post request with declared url in index.js
  //check method used to validate particular property with methods like isLength and setting custom error msg using withMessage methods 
  //res.send(" login Api is called");
  const errors = validationResult(req);
  //validting whether the declared validation is succeded or not if error array is empty we can process the requested data otherwise we can reject the request with proper error msg
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    const { Title, description, Tags } = req.body
    const note = new Note({
      Title, description, user: req.id, Tags
    });
    //saving the collectionrow in particular collection
    await note.save();
    //sending 200 status code which indicates request is successful
    return res.status(200).send(note)
  }
})

//router 2
routes.get('/fetchallnotes', Fetchuser, async (req, res) => {
  //making post request with declared url in index.js
  //check method used to validate particular property with methods like isLength and setting custom error msg using withMessage methods 
  //res.send(" login Api is called");
  try {
    const id = req.id
    const notes = await Note.find({ user: id })
    return res.status(200).json({ notes: notes })
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
})
routes.get('/filternotes/:tag', Fetchuser, async (req, res) => {
  try {
    const id = req.id
    const notes = await Note.find({ user: id, Tags: req.params.tag })
    return res.status(200).json({ notes: notes })
  } catch (error) {
    return res.status(500).send(error)
  }
})
//exporting the routes for this particular file
//router 3
routes.put('/updatenote/:id', Fetchuser, async (req, res) => {
  //making post request with declared url in index.js
  //check method used to validate particular property with methods like isLength and setting custom error msg using withMessage methods 
  //res.send(" login Api is called");
  let newnote = {}
  const { Title, description, Tags } = req.body
  let note = await Note.findById(req.params.id)
  if (!note) {
    return res.status(401).send("Note not exits")
  } else {
    //console.log(note.id.toString(),req.id);
    if (note.user.toString() != req.id) {
      return res.status(401).send("Not allowed")
    } else {
      if (Title) { newnote.Title = Title };
      if (description) { newnote.description = description };
      if (Tags) { newnote.Tags = Tags };
      note = await Note.findByIdAndUpdate(req.params.id, { $set: newnote })
      return res.status(200).send(note)
    }
  }

})
//route 4
routes.delete('/deletenote/:id', Fetchuser, async (req, res) => {
  //making post request with declared url in index.js
  //check method used to validate particular property with methods like isLength and setting custom error msg using withMessage methods 
  //res.send(" login Api is called");

  let note = await Note.findById(req.params.id)
  if (!note) {
    return res.status(401).send("Note not exits")
  } else {
    //console.log(note.id.toString(),req.id);
    if (note.user.toString() != req.id) {
      return res.status(401).send("Not allowed")
    } else {
      note = await Note.findByIdAndDelete(req.params.id)
      return res.status(200).send("deleted")
    }
  }

})
module.exports = routes