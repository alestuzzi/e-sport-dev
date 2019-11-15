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
    },

    players: [{
        type: Schema.Types.ObjectId,
        ref: 'Player',
        default: null,
        required:true,
           /* validate: {
          // Validate that the playersid are valid ObjectId and references existing persons
          validator: validatePlayers,
          message: function(props) { return props.reason.message; }
            } */
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






/* TO DO IMPLEMENTER LA VALIDATION ET SUR TEAM ET TOURNAMENT AUSSI
function validatePlayers(value) {
  return new Promise((resolve, reject) => {

    if (!ObjectId.isValid(value)) {
      throw new Error(`playerId is not a valid Person reference`);
    }

    mongoose.model('Player').find({ _id: ObjectId(value) }).exec()
      .then((player) => {
        if (!player) {
          throw new Error(`playerId does not reference a Person that exists`);
        } else {
          resolve(true);
        }
      })
      .catch(e => { reject(e) });
  })


}
*/

// Create the model from the schema and export it
module.exports = mongoose.model('Team', teamSchema);