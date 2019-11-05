var express = require('express');



const playerRouter = express.Router();
const Player = require('../models/user');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

/* GET users listing by lastname */
playerRouter.get('/', function (req, res, next) {
  Player.find().sort('lastName').exec(function(err, users) {
    if (err) {
      return next(err);
    }
    res.send(users);
  });
});


/* POST one player */
playerRouter.post('/', function (req, res, next) {

  new Player(req.body).save(function (err, savedPlayer) {
    if (err) {
      return next(err);
    }

    res.send(savedPlayer);
  });
});

  
/* GET one player by id */
playerRouter.get('/:id', loadPlayerFromParamsMiddleware, function (req, res, next) {

  res.send(req.player);
});


playerRouter.patch('/:id', function (req, res, next) {
// modification partielle d'un joueur
  
});

playerRouter.delete('/:id', function (req, res, next) {
// suppression complète d'un joueur
  
});


/* FUNCTIONS*/ 


/* catch the id and check it */
function loadPlayerFromParamsMiddleware(req, res, next) {

  const playerId = req.params.id;
  if (!ObjectId.isValid(playerId)) {
    return playerNotFound(res, playerId);
  }

  let query = Player.findById(playerId)

  query.exec(function (err, player) {
    if (err) {
      return next(err);
    } else if (!player) {
      return playerNotFound(res, playerId);
    }

    req.player = player;
    next();
  });
}

/* send an error message if the id is not found */
function PlayerNotFound(res, playerId) {
  return res.status(404).type('text').send(`No player found with that ID ${playerId}`);
}


module.exports = playerRouter;