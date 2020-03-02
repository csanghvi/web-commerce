const mongoose = require('mongoose');


module.exports =  () => {
  console.log('starting connection')
  const mongoDB = 'mongodb://localhost:27017/commerce';
  mongoose.connect(mongoDB, {
    useNewUrlParser: true
  });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', function() {
    console.log("MongoDB database connection established successfully");
  })
}
  
