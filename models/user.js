const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define the schema for users
const userSchema = new Schema({
  firstName: String,
  lastName: String,
  pseudo: String,
  birthDate: {
    type: Date
  },
  picture: String, 
  team: String,
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
// Create the model from the schema and export it
module.exports = mongoose.model('User', userSchema);