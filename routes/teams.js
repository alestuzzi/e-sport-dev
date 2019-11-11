var express = require('express');



const teamRouter = express.Router();
const Team = require('../models/team');
const Player = require('../models/user');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const debug = require('debug');

/**
 * Get the years from now
 *
 * @param date  The date to get the years from now
 */
function yearsFromNow( date ) {
  return (new Date() - date) / 1000 / 60 / 60 / 24 / 365;
}

/**
* Gets the age of a person
*
* @param birthDate  The date when the person was born
*/
function age( birthDate ) {
  return Math.floor( yearsFromNow( birthDate ) );
}


/* GET team listing by name */
teamRouter.get('/', function (req, res, next) {
  Team.find().sort('name').exec(function(err, team) {
    if (err) {
      return next(err);
    }

  /* aggregation of the teams with the players average age */
      Team.aggregate([
        {
          $unwind: 
          {
            path: '$players',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'players',
            foreignField: '_id',
            as: 'playersInTeam'
          }
        },
        
        {
          $group: {
            _id: '$_id',
            name: { $first: '$name' },
            players: { $first: '$playersInTeam' },
            logo: { $first: '$logo' },
            createdAt: { $first: '$createdAt' },
            totalPlayers: { $sum: 1 },
          }
        },
        {
          $sort: {
            name: 1
          }
        },
      ], (err, teams) => {
        if (err) {
          return next(err);
        }
        res.send(team);
        /*
        res.send(teams.map(team => {

          // Transform the aggregated object into a Mongoose model.
          const serialized = new Team(team).toJSON();

          // Add the aggregated property.
          serialized.totalPlayers = team.totalPlayers;

          return serialized;
        }));*/
        
      });

      
  });
});


/* POST one team */
teamRouter.post('/', function (req, res, next) {

  new Team(req.body).save(function (err, savedTeam) {
    if (err) {
      return next(err);
    }

    res.send(savedTeam);
  });
});


 /* GET one team by id */
teamRouter.get('/:id',loadTeamFromParamsMiddleware, function (req, res, next) {

  res.send(req.team);
});

/* PATCH one team by id  */
teamRouter.patch('/:id', loadTeamFromParamsMiddleware, function (req, res, next) {


  // Update only properties present in the request body
  if (req.body.name !== undefined) {
    req.team.name = req.body.name;
  }

  if (req.body.players !== undefined) {
    req.team.players = req.body.players;
  }

  if (req.body.logo !== undefined) {
    req.team.logo = req.body.logo;
  }

  req.team.save(function (err, savedTeam) {
    if (err) {
      return next(err);
    }

    debug(`Updated Team "${savedTeam.name}"`);
    res.send(savedTeam);
  });
});
  

/* DELETE one team by id  */ 
teamRouter.delete('/:id', loadTeamFromParamsMiddleware, function (req, res, next) {

  req.team.remove(function (err) {
    if (err) {
      return next(err);
    }

    debug(`Deleted Team "${req.team.name}"`);
    res.sendStatus(204);
  });
});
  


/* FUCTIONS */
function loadTeamFromParamsMiddleware(req, res, next) {

  const teamId = req.params.id;
  if (!ObjectId.isValid(teamId)) {
    return teamNotFound(res, teamId);
  }

  let query = Team.findById(teamId)

  query.exec(function (err, team) {
    if (err) {
      return next(err);
    } else if (!team) {
      return teamNotFound(res, teamId);
    }

    req.team = team;
    next();
  });
}

/* send an error message if the id is not found */
function TeamNotFound(res, teamId) {
  return res.status(404).type('text').send(`No team found with that ID ${teamId}`);
}



module.exports = teamRouter;