const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const tournamentSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
    	maxlength: 150,
    },
    location: [{
      type: {
        type: String,
        required: true,
        enum: [ 'Point' ]
      },
      coordinates: {
        type: [ Number ],
        required: true,
        validate: {
          validator: validateGeoJsonCoordinates,
          message: '{VALUE} is not a valid longitude/latitude(/altitude) coordinates array'
        }
      }
    }],
    teams: [{
        type: Schema.Types.ObjectId,
        ref: 'Team',
        default: null,
        required:true,
            validate: {
          // Validate that the teamid are valid ObjectId and references existing teams
          validator: validateTeams,
          message: function(props) { return props.reason.message; }
            } 
    }],
    createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a geospatial index on the location property.
tournamentSchema.index({ location: '2dsphere' });
  
 // Validate a GeoJSON coordinates array (longitude, latitude and optional altitude).
 function validateGeoJsonCoordinates(value) {
   return Array.isArray(value) && value.length >= 2 && value.length <= 3 && value[0] >= -180 && value[0] <= 180 && value[1] >= -90 && value[1] <= 90;
 }

// Checks if the team is valid object
function validateTeams(value) {
  return new Promise((resolve, reject) => {

    if (!ObjectId.isValid(value)) {
      throw new Error(`TeamId is not a valid Team reference`);
    }

    // Checks if the team refers to an existing entry
    mongoose.model('Team').find({ _id: ObjectId(value) }).exec()
      .then((team) => {
        if (!team) {
          throw new Error(`TeamId does not reference a Team that exists`);
        } else {
          resolve(true);
        }
      })
      .catch(e => { reject(e) });
  })
}

// Create the model from the schema and export it
module.exports = mongoose.model('Tournament', tournamentSchema);