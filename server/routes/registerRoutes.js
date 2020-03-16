const express = require("express");
const registerRoutes = express.Router();
const [, Users] = require("../models/data.model");
const stripe = require("../utils/stripeConfig");
const axios = require("axios");

const generateToken = require("../auth");

module.exports = app => {
  app.use("/api/register", registerRoutes);
  registerRoutes.route("/").post(async function(req, res) {
    console.log("Received registration Req %o", req.body.userObj);
    Users.findOne(
      {
        email: req.body.email
      },
      async function(err, user) {
        if (!user) {
          try {
            let token = generateToken(req.body.userObj);
            /*
                        Check if a customer object on Stripe is already created, if not, create one.
                        In real world, you can choose to create customer object at different times during the journey
                        In our example we are creating at time of customer sign up, 
                        so we will skip teh step of checking if a stripe customer with same email exists
                        https://stripe.com/docs/api/customers
                        I can choose to create customer object without any fields as well to maintain customer
                        anonymity
                    */

            let stripeCustomerObj = await stripe.customers.create({
              email: req.body.userObj.email
              //    preferred_locales:['english']
            });
            console.log("created cystonreob is %o", stripeCustomerObj.id);
            let newUser = new Users({
              email: req.body.userObj.email,
              password: req.body.userObj.password,
              firstName: req.body.userObj.firstName,
              lastName: req.body.userObj.lastName,
              stripeCustomerId: stripeCustomerObj.id,
              userType: "SELLER"
            });
            await newUser.save();

            console.log("After saving user %o", newUser);
            res.status(200).json({
              user: newUser,
              token: token
            });
          } catch (err) {
            console.log("Failed with err", err);
            res.status(400).send("adding new User failed");
          }
        } else {
          res.status(400).send("User exists");
        }
      }
    );
  });

  return registerRoutes;
};
