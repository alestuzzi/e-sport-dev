const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const teamSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 150,
        validate: {
          // Manually validate uniqueness to send a "pretty" validation error
          // rather than a MongoDB duplicate key error
          validator: validateTeamNameUniqueness,
          message: 'Team with the name: {VALUE} already exists'
        }
    },

    players: [{
        type: Schema.Types.ObjectId,
        ref: 'Player',
        default: null,
        required:true,
           validate: {
          // Validate that the playersid are valid ObjectId and references existing persons
          validator: validatePlayers,
          message: function(props) { return props.reason.message; }
            } 
    }],

    logo: {
        type: String,
        required: true
    },

    createdAt: {
    type: Date,
    default: Date.now
  }

});

// Checks if the player is a valid object
function validatePlayers(value) {
  return new Promise((resolve, reject) => {

    if (!ObjectId.isValid(value)) {
      throw new Error(`playerId is not a valid Person reference`);
    }

    // Checks if the team refers to an existing entry
    mongoose.model('User').find({ _id: ObjectId(value) }).exec()
      .then((user) => {
        if (!user) {
          throw new Error(`playerId does not reference a Person that exists`);
        } else {
          resolve(true);
        }
      })
      .catch(e => { reject(e) });
  })
}

/*
 * Given a title, calls the callback function with true if no team exists with that title
 * (or the only team that exists is the same as the team being validated).
 */
function validateTeamNameUniqueness(value) {
  const TeamModel = mongoose.model('Team', teamSchema);
  return TeamModel.findOne().where('name').equals(value).exec().then( (existingTeam) => {
    return !existingTeam || existingTeam._id.equals(this._id)
  });
}


// Create the model from the schema and export it
module.exports = mongoose.model('Team', teamSchema);