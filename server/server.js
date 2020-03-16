const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const mongooseConnect = require('./mongoose.connect');
const jwt = require('jsonwebtoken');
const checkAuth = require('./checkAuth');

const fs = require('fs');
const join = require('path').join;
const routes = join(__dirname, './routes/');

require('dotenv').config();
if (process.env.NODE_ENV !== 'production') {
   require('dotenv').load();
 }

 app.use(
  express.json({
    // Should use middleware or a function to compute it only when hitting the Stripe webhook endpoint.
    verify: function(req, res, buf) {
      if (req.originalUrl.startsWith("/api/v1/hooks")) {
        req.rawBody = buf.toString();
      }
    }
  })
);
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api/v1',checkAuth);


fs.readdirSync(routes)
  .filter(file => ~file.search(/^[^.].*\.js$/))
  .forEach(file => require(join(routes, file))(app))

 // const loginRoutes = require('./routes/loginRoutes')(app)
 // const registerRoutes = require('./routes/registerRoutes')(app)

app.listen(process.env.SERVER_PORT, function() {
  console.log("Server is running on Port: " + process.env.SERVER_PORT);
});



mongooseConnect()

function generateToken(userObj) {
  //1. Dont use password and other sensitive fields
  //2. Use fields that are useful in other parts of the
  //app/collections/models
   console.log("UserObj received as payload in jwt %o", userObj);
  return token = jwt.sign(userObj, process.env.JWT_SECRET, {
     expiresIn: 60 * 60 * 24 // expires in 24 hours
  });
}


const formidable = require('formidable');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: [process.env.CLIENT_ID,process.env.OTHER_CLIENT_ID]  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userObj = {
    user_id:payload['sub'],
    user_email:payload['email'],
    given_name: payload['given_name'],
    family_name:payload['family_name']
  }
  return userObj;
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
}





