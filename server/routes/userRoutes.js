const express = require('express');
const usersRoutes = express.Router();
const [, Users] = require("../models/data.model");
const stripe = require("../utils/stripeConfig")



module.exports = (app) => {
    app.use('/api/v1/users', usersRoutes);

    usersRoutes.route("/update-account").post(async function(req, res) {
      console.log("Received req to update user account %o", req.body);
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
             
             var savedUser = await Users.findOneAndUpdate({_id: user._id}, 
              {
               $set:{firstName:req.body.firstName, lastName:req.body.lastName}
              }, 
              {new: true, useFindAndModify: false}) 
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



    usersRoutes.route("/bank-account").post(async function(req, res) {
      console.log("Received custom connect BANK ACCOUNT setup Req %o", req.body);
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
             
             var savedUser = await Users.findOneAndUpdate({_id: user._id}, 
              {
               $set:{payoutBankLast4:req.body.bank_account.last4}
              }, 
              {new: true, useFindAndModify: false}) 
              console.log("After saving user %o", savedUser);

              var bankAccount = await stripe.accounts.createExternalAccount(
                savedUser.stripeAccountId,
                {
                  external_account: req.body.id,
                },
              );
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


    usersRoutes.route("/custom-connect").post(async function(req, res) {
      console.log("Received custom connect setup Req %o", req.body);
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
             var stripeAccount = await stripe.accounts.create(
              {
                type: 'custom',
                country: 'US',
                email: user.email,
                requested_capabilities: [
                  'card_payments',
                  'transfers',
                ],
              })
  
              console.log("Recevied rsp from stripe is %o", stripeAccount.id);

              user.stripeAccountId = stripeAccount.id
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

             var savedUser = await Users.findOneAndUpdate({_id: user._id}, 
              {
               $set:{stripeAccountId:stripeAccount.id, stripeAccountType:"CUSTOM"}
              }, 
              {new: true, useFindAndModify: false}) 
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

    usersRoutes.route("/express-connect").post(async function(req, res) {
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
  