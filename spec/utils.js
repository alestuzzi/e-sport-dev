const Player = require('../models/user');

exports.cleanUpDatabase = async function() {
  await Promise.all([
    Player.deleteMany()
  ]);
};