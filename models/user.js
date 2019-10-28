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
  },
  password: {
    type: String,
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
// Create the model from the schema and export it
module.exports = mongoose.model('User', userSchema);