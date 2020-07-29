const mongoose = require('mongoose');


module.exports =  () => {
  console.log('starting connection')
  const mongoDB = process.env.MONGO_DB_URL || 'mongodb://localhost:27017/connect';
  mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useFindAndModify: false 
  });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', function() {
    console.log("MongoDB database connection established successfully");
  })
}
  
