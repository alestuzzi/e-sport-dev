var express = require('express');



const playerRouter = express.Router();
const config = require('../config');
const formatLinkHeader = require('format-link-header');
const Player = require('../models/user');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const debug = require('debug');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY || 'changeme';

const saltRounds = 10;


//FUNCTIONS


//Finds all the women in the Mongoose database
function getAllWomen(){
  
  let query = Player.find();
  query = query.where('gender').equals('female');

  return query.exec();
}
//Finds all the men in the Mongoose database
function getAllMen(){
  
  let query = Player.find();
  query = query.where('gender').equals('male');

  return query.exec();
}





/* GET users listing by lastname */
playerRouter.get('/', function (req, res, next) {

  //Count total players matching the URL query parameters
  const countQuery = Player.find();
  countQuery.count(function (err, total){
    if (err) {
      return next(err);
    }
  // Prepare the initial database query from the URL query parameters
  let query = Player.find();

  // Parse pagination parameters from URL query parameters
  const { page, pageSize } = getPaginationParameters(req)

  // Apply the pagination to the database query
  query = query.skip((page - 1) * pageSize).limit(pageSize);

  // Add the Link header to the response
  addLinkHeader('/api/player', page, pageSize, total, res);
  query.find().sort('pseudo').exec(function(err, users) {
    if (err) {
      return next(err);
    }
    res.send(users);
    });
  }); 

/*   Player.find().sort('lastName').exec(function(err, users) {
    if (err) {
      return next(err);
    }
    res.send(users);
  }); */
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


playerRouter.get('/filter', function (req, res, next) {
  
  // Filter users by gender
  if (req.query.gender) {
    switch (req.query.gender) {
      case 'female':
        getAllWomen().then(players=>{
          res.send(players)
        }).catch(err => console.log(err));
      case 'male':
        getAllMen().then(players => {
          res.send(players)
        }).catch(err => console.log(err));
      break;
    }
  }
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

 // Pagination function
function getPaginationParameters (req) {

  // Parse the "page" URL query parameter indicating the index of the first element that should be in the response
  let page = parseInt(req.query.page, 10);
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  // Parse the "pageSize" URL query parameter indicating how many elements should be in the response
  let pageSize = parseInt(req.query.pageSize, 10);
  if (isNaN(pageSize) || pageSize < 0 || pageSize > 100) {
    pageSize = 100;
  }

  return { page, pageSize };
}; 

function addLinkHeader(resourceHref, page, pageSize, total, res) {

  const links = {};
  const url = config.baseUrl + resourceHref;
  const maxPage = Math.ceil(total / pageSize);

  // Add first & prev links if current page is not the first one
  if (page > 1) {
    links.first = { rel: 'first', url: `${url}?page=1&pageSize=${pageSize}` };
    links.prev = { rel: 'prev', url: `${url}?page=${page - 1}&pageSize=${pageSize}` };
  }

  // Add next & last links if current page is not the last one
  if (page < maxPage) {
    links.next = { rel: 'next', url: `${url}?page=${page + 1}&pageSize=${pageSize}` };
    links.last = { rel: 'last', url: `${url}?page=${maxPage}&pageSize=${pageSize}` };
  }

  // If there are any links (i.e. if there is more than one page),
  // add the Link header to the response
  if (Object.keys(links).length >= 1) {
    res.set('Link', formatLinkHeader(links));
  }
}

module.exports = playerRouter;