var express = require('express');



const playerRouter = express.Router();
const Player = require('../models/user');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const debug = require('debug');
const bcrypt = require('bcrypt');

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

  const plainPassword = req.body.password;
  const saltRounds = 10;
    // hashing the password for security
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
    if (err) {
      return next(err);
    }

      const newPlayer = new Player(req.body);
      newPlayer.password = hashedPassword;

      newPlayer.save(function (err, savedPlayer) {
        if (err) {
          return next(err);
        }

        res.send(savedPlayer);
      });
  });
});

  
/* GET one player by id */
playerRouter.get('/:id', loadPlayerFromParamsMiddleware, function (req, res, next) {

  res.send(req.player);
});


/* PATCH one player by id  */
playerRouter.patch('/:id', loadPlayerFromParamsMiddleware, function (req, res, next) {


  // Update only properties present in the request body
  if (req.body.firstName !== undefined) {
    req.player.firstName = req.body.firstName;
  }

  if (req.body.lastName !== undefined) {
    req.player.lastName = req.body.lastName;
  }

  if (req.body.pseudo !== undefined) {
    req.player.pseudo = req.body.pseudo;
  }

  if (req.body.birthDate !== undefined) {
    req.player.birthDate = req.body.birthDate;
  }

  if (req.body.picture !== undefined) {
    req.player.picture = req.body.picture;
  }

  if (req.body.gender !== undefined) {
    req.player.gender = req.body.gender;
  }

  req.player.save(function (err, savedPlayer) {
    if (err) {
      return next(err);
    }

    debug(`Updated Player "${savedPlayer.pseudo}"`);
    res.send(savedPlayer);
  });
});

/* DELETE one player by id  */ 
playerRouter.delete('/:id', loadPlayerFromParamsMiddleware, function (req, res, next) {

  req.player.remove(function (err) {
    if (err) {
      return next(err);
    }

    debug(`Deleted Player "${req.player.pseudo}"`);
    res.sendStatus(204);
  });
});



/* LOGIN (A METTRE ET ICI ?) */ 
// TO DO CHECK CA AVEC SIMON
playerRouter.post('/login', function(req, res, next) {
  Player.findOne({ pseudo: req.body.pseudo }).exec(function(err, player) {
    if (err) {
      return next(err);
    } else if (!player) {
      return res.sendStatus(401);
    }
    bcrypt.compare(req.body.password, player.password, function(err, valid) {
      if (err) {
        return next(err);
      } else if (!valid) {
        return res.sendStatus(401);
      }
      // Login is valid...
      res.send(`Welcome ${player.pseudo}!`);
    });
  })
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