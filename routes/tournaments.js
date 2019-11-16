var express = require('express');

const tournamentRouter = express.Router();
const Tournament = require('../models/tournament');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const debug = require('debug');


const { availableTournament } = require('../dispatcher');
/**
 * @api {get} /api/tournament List Tournaments
 * @apiName RetrieveTournament
 * @apiGroup Tournament
 * @apiVersion 1.0.0
 * @apiDescription Retrieves a list of the tournaments
 * @apiUse TournamentInResponseBody
 *
 *
 * @apiExample Example
 *     GET /api/tournament HTTP/1.1
 *
 * @apiSuccessExample 200 OK
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     Link: &lt;https://evening-meadow-25867.herokuapp.com/api/movies?page=1&pageSize=50&gt;; rel="first prev"
 *
 *		{
 *		    "location": {
 *		        "coordinates": [
 *		            102,
 *		            0.5
 *		        ]
 *		    },
 *		    "teams": [
 *		        "111154f23437342a74ffe121",
 *		        "333154f23437342a74ffe122",
 *		        "333454f23437342a74ffe123",
 *		        "333154f23437342a74ffe124",
 *		        "333154f23437342a74ffe125",
 *		        "333154f23437342a74ffe126"
 *		    ],
 *		    "_id": "5dc976e4fcd1fd5ae0cc8f39",
 *		    "createdAt": "2019-11-11T14:57:40.470Z",
 *		    "__v": 0
 *		}
 */



/* GET users listing by name */
tournamentRouter.get('/', function (req, res, next) {
  Tournament.find().sort('name').exec(function(err, tournament) {
    if (err) {
      return next(err);
    }
    res.send(tournament);
  });
});


/**
 * @api {post} /api/tournament Create a tournament
 * @apiName CreateTournament
 * @apiGroup Tournament
 * @apiVersion 1.0.0
 * @apiDescription Registers a new tournament.
 *
 * @apiUse TournamentInRequestBody
 * @apiUse TournamentInResponseBody
 * @apiSuccess (Response body) {String} id A unique identifier for the tournament generated by the server
 *
 * @apiExample Example
 *     POST /api/tournament HTTP/1.1
 *     Content-Type: application/json
 *
 *   {
 *       "location": {
 *           "coordinates": [102.0, 0.5]
 *       },
 *       "teams": [
 *           "111154f23437342a74ffe121",
 *           "333154f23437342a74ffe122",
 *           "333454f23437342a74ffe123",
 *           "333154f23437342a74ffe124",
 *           "333154f23437342a74ffe125",
 *           "333154f23437342a74ffe126"
 *       ],
 *       "name": "Tournament Exemple"
 *   }
 *
 *
 * @apiSuccessExample 201 Created
 *     HTTP/1.1 201 Created
 *     Content-Type: application/json
 *     Location: https://evening-meadow-25867.herokuapp.com/api/movies/58b2926f5e1def0123e97281
 *
 *		{
 *		    "location": {
 *		        "coordinates": [
 *		            102,
 *		            0.5
 * 		        ]
 *		    },
 *		    "teams": [
 *		        "111154f23437342a74ffe121",
 *		        "333154f23437342a74ffe122",
 *		        "333454f23437342a74ffe123",
 *		        "333154f23437342a74ffe125",
 *		        "333154f23437342a74ffe126"
 *		    ],
 *		    "_id": "5dc976e4fcd1fd5ae0cc8f39",
 *		    "name": "Tournament Exemple",
 *		    "createdAt": "2019-11-11T14:57:40.470Z",
 *		    "__v": 0
 *		}
 */


/* POST one tournament */
tournamentRouter.post('/', function (req, res, next) {

  new Tournament(req.body).save(function (err, savedTournament) {
    if (err) {
      return next(err);
    }

  availableTournament();

    res.send(savedTournament);
  });
});
 


/**
 * @api {get} /api/tournament/:id Retrieve a tournament
 * @apiName RetrieveTournament
 * @apiGroup Tournament
 * @apiVersion 1.0.0
 * @apiDescription Retrieves a tournament.
 *
 * @apiUse TournamentInResponseBody
 * @apiUse TournamentNotFoundError
 *
 * @apiExample Example
 *     GET /api/tournament/5dc2ea214d7a71492043832d HTTP/1.1
 *
 * @apiSuccessExample 200 OK
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *
 *		 {
 * 		    "location": {
 * 		        "coordinates": [
 *		            102,
 *		            0.5
 *		        ]
 *		    },
 *		    "teams": [
 *		        "111154f23437342a74ffe121",
 *		        "333154f23437342a74ffe122",
 *		        "333454f23437342a74ffe123",
 *		        "333154f23437342a74ffe124",
 *		        "333154f23437342a74ffe125",
 *		        "333154f23437342a74ffe126"
 *		    ],
 *		    "_id": "5dc976e4fcd1fd5ae0cc8f39",
 *		    "name": "Tournament Exemple",
 *		    "createdAt": "2019-11-11T14:57:40.470Z",
 *		    "__v": 0
 *		}
 */


/* GET one tournament by id */
tournamentRouter.get('/:id', loadTournamentFromParamsMiddleware, function (req, res, next) {

  res.send(req.tournament);
});
  
/**
 * @api {patch} /api/tournament/:id Partially update a tournament
 * @apiName PartiallyUpdateTournament
 * @apiGroup Tournament
 * @apiVersion 1.0.0
 * @apiDescription Partially updates a tournament's data
 *
 * @apiUse TournamentInRequestBody
 * @apiUse TournamentInResponseBody
 * @apiUse TournamentNotFoundError
 * 
 *
 * @apiExample Example
 *     PATCH /api/tournament/5dc2ea214d7a71492043832d HTTP/1.1
 *     Content-Type: application/json
 *
 *    {
 *      "location": {
 *          "coordinates": [102.0, 0.5]}
 *   }
 *
 * @apiSuccessExample 200 OK
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *
 *	{
 *	    "location": {
 *	        "coordinates": [
 *	            102,
 *	            0.5
 *	        ]
 *	    },
 *	    "teams": [
 *	        "111154f23437342a74ffe121",
 *	        "333154f23437342a74ffe122",
 *	        "333454f23437342a74ffe123",
 *	        "333154f23437342a74ffe124",
 *	        "333154f23437342a74ffe125",
 *	        "333154f23437342a74ffe126"
 *	    ],
 *	    "_id": "5dc976e4fcd1fd5ae0cc8f39",
 *	    "name": "Tournament Exemple",
 * 	    "createdAt": "2019-11-11T14:57:40.470Z",
 * 	    "__v": 0
 *	}
 *
*/


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



/**
 * @api {delete} /api/tournament/:id Delete a tournament
 * @apiName DeleteTournament
 * @apiGroup Tournament
 * @apiVersion 1.0.0
 * @apiDescription Permanently deletes a tournament.
 *
 * 
 * @apiUse TournamentNotFoundError
 *
 * @apiExample Example
 *     DELETE /api/tournament/5dc976e4fcd1fd5ae0cc8f39 HTTP/1.1
 *
 * @apiSuccessExample 204 No Content
 *     HTTP/1.1 204 No Content
 */


/* DELETE one player by id  */ 
tournamentRouter.delete('/:id', loadTournamentFromParamsMiddleware, function (req, res, next) {

  req.tournament.remove(function (err) {
    if (err) {
      return next(err);
    }

    availableTournament();

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


/**
 * @apiDefine TournamentNotFoundError
 *
 * @apiError {Object} 404/NotFound No tournament was found corresponding to the ID in the URL path
 *
 * @apiErrorExample {json} 404 Not Found
 *     HTTP/1.1 404 Not Found
 *     Content-Type: text/plain
 *
 *     No tournament found with ID 5dc976e4fcd1fd5ae0cc8f39
 */


/**
 * @apiDefine TournamentInRequestBody
 * @apiParam (Request body) {String{3..150}} name The name of the tournament (must be unique)
 * @apiParam (Request body) {ObjectId} teams Array of id's of the teams in the tournament
 * @apiParam (Request body) {String} [Number] location Coordinates of the tournament  
*/

/**
 * @apiDefine TournamentInResponseBody
 * @apiSuccess (Response body) {String} name The name of the tournament (must be unique)
 * @apiSuccess (Response body) {ObjectId} teams Array of id's of the teams in the tournament
 * @apiSuccess (Response body) {String} [Number] location Coordinates of the tournament  
 * @apiSuccess (Response body) {Date} createdAt The date at which the player was registered
*/


module.exports = tournamentRouter;