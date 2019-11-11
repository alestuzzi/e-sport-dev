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
    location: {
        type: { type: String },
        coordinates: [Number],
    },

    teams: [{
        type: Schema.Types.ObjectId,
        ref: 'Team',
        default: null,
        required:true,
           /* validate: {
          // Validate that the playersid are valid ObjectId and references existing persons
          validator: validatePlayers,
          message: function(props) { return props.reason.message; }
            } */
    }],

    createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the model from the schema and export it
module.exports = mongoose.model('Tournament', tournamentSchema);