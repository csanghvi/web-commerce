var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt')
SALT_WORK_FACTOR = 10;

const Listings = new Schema({
  listingId: {
      type: String
    },
  title: {
        type: String
    },
    description: {
        type: String
    },
    listingType: {
        type: String,
        enum : ['EVENTS','PRODUCTS'],
        default: 'EVENTS'
    },
    creator:{
      type: String
    },
    dateCreated:{
      type:Date
    }, 
    images: {
      type:[String]
    },
    location:{
      type:String
    }
},{ strict: false });

const Users = new Schema({
  userId: {
    type: String
  },
  lastName: {
    type: String
  },
  firstName: {
    type: String
  },
  email: { 
    type: String, 
    required: true
  },
  password: { 
    type: String, 
    required: true 
  },
  myListings: {
    type: [String]
  },
  myPurchases: {
    type: [String]
  },
  stripeCustomerObject: {
    type: Object
  },
  stripeAccountObject: {
    type: Object
  }
}, {
  strict: false
});

Users.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err);

      // hash the password using our new salt
      bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) return next(err);

          // override the cleartext password with the hashed one
          user.password = hash;
          next();
      });
  });
});

Users.methods.comparePassword = function(givenPassword, cb) {
  bcrypt.compare(givenPassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });
};

module.exports = [mongoose.model('Listings', Listings), mongoose.model('Users', Users)]
