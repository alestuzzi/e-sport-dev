var express = require('express');



const playerRouter = express.Router();
const Player = require('../models/user');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const debug = require('debug');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY || 'changeme';

const saltRounds = 10;

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
playerRouter.patch('/:id', authenticate, loadPlayerFromParamsMiddleware, function (req, res, next) {

  Player.findById(req.params.id).exec(async function(err, player) {
    
    if (err) {
      return next(err);
    }
    // Check authorization
    // Compare current id with id player 
    if (req.currentUserId !== player.id.toString()) {
      return res.status(403).send('Do not patch another player, not cool.')
    }

    try {

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
      // promise to wait for the hash to be done 
      if (req.body.password !== undefined) {
        req.player.password = await bcrypt.hash(req.body.password, saltRounds);
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

    } catch (err) {
      next(err);
    }
  });  


});

/* DELETE one player by id  */ 
playerRouter.delete('/:id', authenticate, loadPlayerFromParamsMiddleware, function (req, res, next) {

  
  Player.findById(req.params.id).exec(function(err, player) {
    
    if (err) {
      return next(err);
    }
    // Check authorization
    // Compare current id with id player 
    if (req.currentUserId !== player.id.toString()) {
      return res.status(403).send('Do not delete another player, not cool.')
    }

     debug(`Deleted Player "${req.player.pseudo}"`);
     res.sendStatus(204);
  });



});




/* LOGIN  */ 

playerRouter.post('/login', function(req, res, next) {
  // Find the user by pseudo.
  Player.findOne({ pseudo: req.body.pseudo }).exec(function(err, player) {
    if (err) { return next(err); }
    else if (!player) { return res.sendStatus(401); }
    // Validate the password.
    bcrypt.compare(req.body.password, player.password, function(err, valid) {
      if (err) { return next(err); }
      else if (!valid) { return res.sendStatus(401); }
      // Generate a valid JWT which expires in 7 days.
      const exp = (new Date().getTime() + 7 * 24 * 3600 * 1000) / 1000;
      const claims = { sub: player._id.toString(), exp: exp };
      jwt.sign(claims, secretKey, function(err, token) {
        if (err) { return next(err); }
        res.send({ token: token }); // Send the token to the client.
      });
    });
  })
});






/* FUNCTIONS*/ 


/* catch the id and check it */
function loadPlayerFromParamsMiddleware(req, res, next) {

  const playerId = req.params.id;
  if (!ObjectId.isValid(playerId)) {
    return PlayerNotFound(res, playerId);
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


function authenticate(req, res, next) {
  // Ensure the header is present.
  const authorization = req.get('Authorization');
  if (!authorization) {
    return res.status(401).send('Authorization header is missing');
  }
  // Check that the header has the correct format.
  const match = authorization.match(/^Bearer (.+)$/);
  if (!match) {
    return res.status(401).send('Authorization header is not a bearer token');
  }
  // Extract and verify the JWT.
  const token = match[1];
  jwt.verify(token, secretKey, function(err, payload) {
    if (err) {
      return res.status(401).send('Your token is invalid or has expired');
    } else {
      req.currentUserId = payload.sub;
      next(); // Pass the ID of the authenticated user to the next middleware.
    }
  });
}

module.exports = playerRouter;