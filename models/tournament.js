const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

// define shema for tournament
const tournamentSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
    	maxlength: 150,
    },
    location:  [{
      type: Schema.Types.ObjectId,
      ref: 'Location',
      default: null,
      required:true,
         /* validate: {
        // Validate that the locationid are valid ObjectId and references existing location
        validator: validateGeoJsonCoordinates,
        message: function(props) { return props.reason.message; }
          } */
    }],
    teams: [{
        type: Schema.Types.ObjectId,
        ref: 'Team',
        default: null,
        required:true,
           /* validate: {

          // Validate that the teamid are valid ObjectId and references existing teams
          validator: validateTeams,

          message: function(props) { return props.reason.message; }
            } */
    }],
    createdAt: {
    type: Date,
    default: Date.now
  }
});

/* TO DO IMPLEMENTER LA VALIDATION ET SUR TEAM ET TOURNAMENT AUSSI
function validateTournaments(value) {
  return new Promise((resolve, reject) => {

    if (!ObjectId.isValid(value)) {
      throw new Error(`tournamentId is not a valid Tournament reference`);
    }

    mongoose.model('Player').find({ _id: ObjectId(value) }).exec()
      .then((player) => {
        if (!player) {
          throw new Error(`tournamentId does not reference a Tournament that exists`);
        } else {
          resolve(true);
        }
      })
      .catch(e => { reject(e) });
  })


}
*/

// Create the model from the schema and export it
module.exports = mongoose.model('Tournament', tournamentSchema);