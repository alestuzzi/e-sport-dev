const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
// Define the schema for users
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 200,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 200,
  },
  pseudo: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 200,
    unique: true,
    validate: {
      // Manually validate uniqueness to send a "pretty" validation error
      // rather than a MongoDB duplicate key error
      validator: validatePseudoUniqueness,
      message: 'Player with the nickname:  {VALUE} already exists'
    }
  },
  password: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date
  },
  picture: String, 
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.set('toJSON', {
   transform: transformJsonUser
});

function transformJsonUser(doc, json, options) {
  // Remove the hashed password from the generated JSON.
  delete json.password;
  return json;
}

/*
 * Given a title, calls the callback function with true if no Player exists with that title
 * (or the only Player that exists is the same as the Player being validated).
 */
function validatePseudoUniqueness(value) {
  const PlayerModel = mongoose.model('User', userSchema);
  return PlayerModel.findOne().where('pseudo').equals(value).exec().then( (existingPlayer) => {
    return !existingPlayer || existingPlayer._id.equals(this._id)
  });
}

// Create the model from the schema and export it
module.exports = mongoose.model('User', userSchema);