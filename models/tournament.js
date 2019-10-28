const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tournamentSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: { type: String },
        coordinates: [Number],
    }
});