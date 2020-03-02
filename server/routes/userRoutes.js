const express = require('express');
const usersRoutes = express.Router();



module.exports = (app) => {
    app.use('/api/v1/users', usersRoutes);

usersRoutes.route('/getnotebooks').post(async function(req, res) {
    console.log("received a req to get Notebooks");
    new formidable.IncomingForm().parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error', err)
        throw err
      }
      var user_email = JSON.parse(fields.user_email);
      console.log("Add Notes body is %o", user_email)
      var user = await Users.findOne({user_email:user_email});
      if (!user) {
          //Create a user in Database;
          console.log("User not found");
          res.status(400).send('fetching notebooks failed, user not found');
        } else {
          res.status(200).json(user.notebooks);
        }
      });
  });
  
  usersRoutes.route('/addnotebook').post(async function(req, res) {
    console.log("received a req to add Notebook");
    new formidable.IncomingForm().parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error', err)
        throw err
      }
      var notebook = JSON.parse(fields.notebook);
      console.log("Add Notes body is %o", notebook)
      var user_email = JSON.parse(fields.user_email);
      console.log("Add Notes body is %o", user_email)
      var user = await Users.findOne({user_email:user_email});
      if (!user) {
          //Create a user in Database;
          console.log("User not found");
          res.status(400).send('Updating notebook failed, user not found');
        } else {
          user.notebooks.push(notebook);
          await user.save();
          res.status(200).json(user.notebooks);
        }
      });
  });

  return usersRoutes
}
  