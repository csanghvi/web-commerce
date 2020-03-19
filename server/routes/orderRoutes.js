const express = require('express');
const orderRoutes = express.Router();
const [Listings, Users, Orders] = require("../models/data.model");
const stripe = require("../utils/stripeConfig")

module.exports = (app) => {
    app.use('/api/v1/orders', orderRoutes);
    orderRoutes.route('/').get(function(req, res) {
        let email = req.query.email
        console.log("Listing filter is %o", email)   
        if (email) {
          Orders.find({
            email: email
          }, function(err, orders) {
            if (err) {
              console.log(err);
              res.status(404).json({error:"User Not Found"})
            } else {
              console.log("responding with ", orders);
              res.json(orders);
            }
          });
        } else  {
            res.status(404).json({error:"User Not Found"})
        }
      });
    
  return orderRoutes
}
  