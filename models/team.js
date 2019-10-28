const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    players: { // comment en mettre plusieurs et le relier à users?
        type: [{type: ObjectId, ref: "user"}]
    },
    logo: {
        type: String,
        required: true
    }

});