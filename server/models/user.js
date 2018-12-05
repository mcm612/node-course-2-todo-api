const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true, //verifies that the email is the only one in the collection
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            require: true
        },
        token: {
            type: String,
            require: true
        }
    }]
});
//we can limit the data that comes back when we convert one of our instances
//into a JSON value
//we can override a method to update exactly how mongoose certain things.
UserSchema.methods.toJSON = function () {
    var user = this;
    //user.toObject();
    // takes user variable and converts it into an object
    // where only the properties of the document exist
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  //we need an access and token value in order to create a new token inside the document
  //two arguments - data we want to sign, such as id and secret value
  var token = jwt.sign({_id: user._id.toHexString(), access: access},'abc123').toString();
  
  //now we need to update the user tokens array
  //before
  //user.tokens.push({access, token});
  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(() => {
      return token;
  });
};

//model method
UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    //return a promise that always rejects
    // return new Promise((resolve, reject) => {
    //     reject();
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};
var User = mongoose.model('User', UserSchema);
module.exports = {User};
  
