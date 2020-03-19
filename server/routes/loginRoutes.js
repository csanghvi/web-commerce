const express = require("express");
const loginRoutes = express.Router();
const [, Users] = require("../models/data.model");
const generateToken = require("../auth");

module.exports = app => {
  app.use("/api/login", loginRoutes);

  loginRoutes.route("/").post(async function(req, res) {
    console.log("Received Login Req %o", req.body);
    Users.findOne({ email: req.body.email }, function(err, user) {
      if (!user) {
        res.status(400).send("User not found");
      } else {
        console.log("User Found with info %o", user);
        user.comparePassword(req.body.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            let token = generateToken(user);
            res.status(200).json({ user: user, token: token });
          } else {
            res.status(400).send("Password did not match");
          }
        });
      }
    });

  });

  return loginRoutes;
};
