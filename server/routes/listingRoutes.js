const express = require('express');
const listingsRoutes = express.Router();

module.exports = (app) => {
    app.use('/api/v1/listings', listingsRoutes);

listingsRoutes.route('/').get(function(req, res) {
    console.log("received a req to list %o & %o", req.query.user_email, req.query.notebook);
    if (req.query.notebook === 'All') {
      Notes.find({
        user_email: req.query.user_email
      }, function(err, note) {
        if (err) {
          console.log(err);
        } else {
          console.log("responding with ", note);
          res.json(note);
        }
      });
    } else {
      Notes.find({
        user_email: req.query.user_email,
        notebook: req.query.notebook
      }, function(err, note) {
        if (err) {
          console.log(err);
        } else {
          console.log("responding with ", note);
          res.json(note);
        }
      });
    }
  });
  
  
  
  listingsRoutes.route('/delete/:id').delete(function(req, res) {
    let id = req.params.id;
    console.log("Request to delete note with id %o", id);
  
    Notes.remove({
      _id: id
    }, function(err, note) {
      if (!err) {
        res.json({
          status:'Success',
          message: `deleted ${ req.params.id }`
        })
      } else {
        res.send(err);
      }
    });
  });
  
  listingsRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
  
    Notes.findById(id, function(err, note) {
      res.json(note);
    });
  });
  

  listingsRoutes.route('/add').post(function(req, res) {
    console.log("received a req to add %o", req.body.user);
    new formidable.IncomingForm().parse(req, (err, fields, files) => {
      if (err) {
        console.error('Error', err)
        throw err
      }
      var body = JSON.parse(fields.note);
      console.log("Add Notes body is %o", body)
      var user_email = JSON.parse(fields.user_email);
      var notebook = JSON.parse(fields.notebook);
      console.log("Add Notes user is %o", user_email)
  
      let note = new Notes(body);
      note.user_email = user_email;
  
      note.notebook = notebook;
      note.save()
        .then(n => {
          console.log("status %o", n);
          res.status(200).json({
            'id': `${n._id}`,
            'status': "Success"
          });
        })
        .catch(err => {
          console.log("Failed with err", err);
          res.status(400).send('adding new Note failed');
        });
    })
  });
  
  listingsRoutes.route('/update/:id').post(function(req, res) {
    console.log("received a req to updat for %o", req.params.id);
    Notes.findById(req.params.id, function(err, note) {
      if (!note)
        res.status(404).send('data is not found');
      else
        new formidable.IncomingForm().parse(req, (err, fields, files) => {
          if (err) {
            console.error('Error', err)
            throw err
          }
          var body = JSON.parse(fields.note)
          console.log("Body is %o", body);
  
          note.title = body.title;
          note.description = body.description;
          note.content = body.content;
          note.tags = body.tags;
          note.updated = Date.now();
          note.notebook = body.notebook || note.notebook;
  
          note.save().then(n => {
              res.json('Notes updated');
            })
            .catch(err => {
              res.status(400).send("Update not possible");
            });
        });
    });
  });
  return listingsRoutes
}
