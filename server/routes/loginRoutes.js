const express = require("express");
const loginRoutes = express.Router();
const [, Users] = require("../models/data.model");
const generateToken = require("../auth");
const stripe = require('../utils/stripeConfig')

module.exports = app => {
  app.use("/api/login", loginRoutes);

  loginRoutes.route("/").post(async function(req, res) {
    console.log("Received Login Req %o", req.body);
    Users.findOne({ email: req.body.email }, function(err, user) {
      if (!user) {
        res.status(400).send("User not found");
      } else {
        console.log("User Found with info %o", user);
        user.comparePassword(req.body.password, async (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            let token = generateToken(user);
            /*
              Get Stripe Account
            */
           var updatedUser = user
           if (user.stripeAccountId) {
              var stripeAccount = await stripe.accounts.retrieve(user.stripeAccountId)
              //console.log("StripeAccount details is %o", stripeAccount)
                updatedUser = await Users.findOneAndUpdate({_id: user._id}, 
                {
                 $set:{
                  stripeAccountCharges: stripeAccount.charges_enabled,
                  stripeAccountPayouts: stripeAccount.payouts_enabled,
                  requirements: stripeAccount.requirements
                  }
                }, 
                {new: true, useFindAndModify: false})
            }
            console.log("User Found with info %o", updatedUser);
            res.status(200).json({ user: updatedUser, token: token });
          } else {
            res.status(400).send("Password did not match");
          }
        });
      }
    });

  });

  return loginRoutes;
};
