const jwt = require("jsonwebtoken");

function generateToken(userObj) {
    //1. Dont use password and other sensitive fields
    //2. Use fields that are useful in other parts of the
    //app/collections/models
     console.log("UserObj received as payload in jwt %o", userObj);
    return token = jwt.sign(userObj.email, process.env.JWT_SECRET );
  }

  module.exports = generateToken