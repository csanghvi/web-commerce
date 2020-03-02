const express = require('express');
const registerRoutes = express.Router();
const [ , Users] = require('../models/data.model');

const generateToken = require('../auth')

module.exports = (app) => {

    app.use('/api/register', registerRoutes);
    registerRoutes.route('/').post(async function(req, res) {
        console.log("Received registration Req %o", req.body.userObj );
        Users.findOne({email:req.body.email}, function(err, user) {
            if (!user){
                //Create a user in Database;
    
                let newUser = new Users(req.body.userObj);
                newUser.save()
                .then(n => {
                    console.log("status %o", n);
                    var token = generateToken(req.body.userObj);
                    res.status(200).json({user:newUser.email, token:token});
                })
                .catch(err => {
                    console.log("Failed with err", err);
                    res.status(400).send('adding new User failed');
                });
            } else {
                res.status(400).send('User exists');
            }

        });  
  });

  return registerRoutes;
}
  