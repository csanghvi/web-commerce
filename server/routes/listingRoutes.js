const express = require('express');
const listingsRoutes = express.Router();
const [ Listings , Users] = require('../models/data.model');

module.exports = (app) => {
    app.use('/api/v1/listing', listingsRoutes);

listingsRoutes.route('/all').get(function(req, res) {
    let filter = JSON.parse(req.query.filter)
    console.log("Listing filter is %o", filter)   
    if (filter.email) {
      Listings.find({
        email: filter.email
      }, function(err, listings) {
        if (err) {
          console.log(err);
        } else {
          console.log("responding with ", listings);
          res.json(listings);
        }
      });
    } else if (filter.location) {
      Listings.find({
        location: filter.location
      }, function(err, listings) {
        if (err) {
          console.log(err);
        } else {
          console.log("responding with ", listings);
          res.json(listings);
        }
      });
    } else  {
      Listings.find({}, function(err, listings) {
        if (err) {
          console.log(err);
        } else {
          console.log("responding with ", listings);
          res.json(listings);
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
  
    Listings.findById(id, function(err, listing) {
      res.json(listing);
    });
  });
  

  listingsRoutes.route('/new').post(function(req, res) {
    console.log("received a req to add email %o", req.body.email);
    console.log("received a req to add %o", req.body);
    const data = req.body;
    let listing = new Listings(data);
    listing.creator = req.body.email;
      listing.save()
        .then(n => {
          console.log("status %o", n);
          res.status(200).json({
            'id': `${n._id}`,
            'status': "Success"
          });
        })
        .catch(err => {
          console.log("Failed with err", err);
          res.status(400).send('adding new listing failed');
        });
  });
  
  listingsRoutes.route('/update/:id').post(function(req, res) {
    console.log("received a req to updat for %o", req.params.id);
    Listings.findById(req.params.id, function(err, listing) {
      if (!listing)
        res.status(404).send('data is not found');
      else{
          const body = req.body
          console.log("Body is %o", req.body);
  
          listing.title = body.title;
          listing.details = body.description;
          listing.images = body.images;
          listing.date = body.date;
          listing.location = body.location;
          listing.updated = Date.now();
  
          listing.save().then(n => {
              res.json('Listing updated');
            })
            .catch(err => {
              res.status(400).send("Update not possible");
            });
        }
    });
  });


  return listingsRoutes
}
