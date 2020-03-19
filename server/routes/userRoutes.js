const express = require('express');
const usersRoutes = express.Router();
const [, Users] = require("../models/data.model");
const stripe = require("../utils/stripeConfig")



module.exports = (app) => {
    app.use('/api/v1/users', usersRoutes);

    usersRoutes.route("/connect").post(async function(req, res) {
      console.log("Received connect setup Req %o", req.body);
      var code = req.body.code;
      Users.findOne(
        {
          email: req.body.email
        },
        async function(err, user) {
          try {
            if (user) {
              /*
              var stripeRsp = await axios.post(
                "https://connect.stripe.com/oauth/token",
                bodyParameters,
                config
              );
              */
             var stripeRsp = await stripe.oauth.token({
              grant_type: "authorization_code",
              code
             })
  
              console.log("Recevied rsp from stripe is %o", stripeRsp.stripe_user_id);
  
              let stripeAccountId = stripeRsp.stripe_user_id;
              user.stripeAccountId = stripeRsp.stripe_user_id
              /*
              await user.save();
             
              console.log("After saving user %o", user);
              res.status(200).json({
                user: user
              });

              
              var savedUser = await Users.update({_id: user._id}, {
                stripeAccountId: stripeAccountId
              }, function(err, affected, resp) {
                console.log(resp);
              })
              */

             var savedUser = await Users.findOneAndUpdate({_id: user._id}, {$set:{stripeAccountId:stripeAccountId}}, {new: true, useFindAndModify: false}) 
              console.log("After saving user %o", savedUser);
              res.status(200).json({
                user: savedUser
              });
              
            } else {
              res.status(400).send("Failed to update user");
            }
          } catch (err) {
              console.log("Failed with error code %o", err)
            res.status(400).send("Failed to udpate user");
          }
        }
      );
    });

    usersRoutes.route("/login-status").post(async function(req, res) {
      console.log("Received check Login Req %o", req.body);
      Users.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          res.status(400).send("User not found");
        } else {
          console.log("User Found with info %o", user);
          res.status(200).json({ user: user });
        }
      });
    });

  return usersRoutes
}
  