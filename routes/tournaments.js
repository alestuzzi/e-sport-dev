var express = require('express');

const tournamentRouter = express.Router();
const Tournament = require('../models/tournament');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const debug = require('debug');

/* GET users listing by name */
tournamentRouter.get('/', function (req, res, next) {
  Tournament.find().sort('name').exec(function(err, tournament) {
    if (err) {
      return next(err);
    }
    res.send(tournament);
  });
});


/* POST one tournament */
tournamentRouter.post('/', function (req, res, next) {

  new Tournament(req.body).save(function (err, savedTournament) {
    if (err) {
      return next(err);
    }

    res.send(savedTournament);
  });
});
  

/* GET one tournament by id */
tournamentRouter.get('/:id', loadTournamentFromParamsMiddleware, function (req, res, next) {

  res.send(req.tournament);
});
  
/* PATCH one tournament by id  */
tournamentRouter.patch('/:id', loadTournamentFromParamsMiddleware, function (req, res, next) {



  // Update only properties present in the request body
  if (req.body.name !== undefined) {
    req.tournament.name = req.body.name;
  }

  if (req.body.location !== undefined) {
    req.tournament.location = req.body.location;
  }

  if (req.body.teams !== undefined) {
    req.tournament.teams = req.body.teams;
  }

    req.tournament.save(function (err, savedTournament) {
    if (err) {
      return next(err);
    }

    debug(`Updated Tournament "${savedTournament.name}"`);
    res.send(savedTournament);
  });
  
});


/* DELETE one player by id  */ 
tournamentRouter.delete('/:id', loadTournamentFromParamsMiddleware, function (req, res, next) {

  req.tournament.remove(function (err) {
    if (err) {
      return next(err);
    }

    debug(`Deleted Tournament "${req.tournament.name}"`);
    res.sendStatus(204);
  });
});
  



/* FUNCTIONS*/ 


/* catch the id and check it */
function loadTournamentFromParamsMiddleware(req, res, next) {

  const tournamentId = req.params.id;
  if (!ObjectId.isValid(tournamentId)) {
    return tournamentNotFound(res, tournamentId);
  }

  let query = Tournament.findById(tournamentId)

  query.exec(function (err, tournament) {
    if (err) {
      return next(err);
    } else if (!tournament) {
      return tournamentNotFound(res, tournamentId);
    }

    req.tournament = tournament;
    next();
  });
}

/* send an error message if the ID is not found */
function TournamentNotFound(res, tournamentId) {
  return res.status(404).type('text').send(`No tournament found with that ID ${tournamentId}`);
}

module.exports = tournamentRouter;