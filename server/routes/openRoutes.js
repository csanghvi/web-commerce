const express = require('express');
const openRoutes = express.Router();
const [ Listings , Users] = require('../models/data.model');

module.exports = (app) => {
    app.use('/api/', openRoutes);

openRoutes.route('/listings/all').get(function(req, res) {
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
  
  
  
  openRoutes.route('/listings/:id').get(function(req, res) {
    let id = req.params.id;
  
    Listings.findById(id, function(err, listing) {
      res.json(listing);
    });
  });
  
  return openRoutes;
}
