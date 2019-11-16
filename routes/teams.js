var express = require('express');



const teamRouter = express.Router();
const Team = require('../models/team');
const Player = require('../models/user');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const debug = require('debug');

/**
 * @api {get} /api/team List Teams
 * @apiName RetrieveTeams
 * @apiGroup Team
 * @apiVersion 1.0.0
 * @apiDescription Retrieves a list of the teams
 * 
 * @apiUse TeamInResponseBody
 *
 *
 * @apiExample Example
 *     GET /api/team HTTP/1.1
 *
 * @apiSuccessExample 200 OK
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *     Link: &lt;https://e-sport-dev.herokuapp.com/api/teams;; rel="first prev"
 *
 *    {
 *       "players": [
 *           "111154f23437342a74ffe121",
 *           "333154f23437342a74ffe122",
 *           "333454f23437342a74ffe123",
 *           "333154f23437342a74ffe124",
 *           "333154f23437342a74ffe125",
 *           "333154f23437342a74ffe126"
 *       ],
 *       "_id": "5dc1767576846e18643fe750",
 *       "name": "Orlando",
 *       "logo": "http://blabla",
 *       "__v": 5,
 *       "createdAt": "2019-11-11T14:19:21.593Z",
 *       "totaPlayers": "6"
 *  }
 */
teamRouter.get('/', function (req, res, next) {
  Team.find().sort('name').exec(function(err, team) {
    if (err) {
      return next(err);
    }

  /* Aggregation of the teams with the number of players in each team */
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

/**
 * @api {post} /api/team Create a team
 * @apiName CreateTeam
 * @apiGroup Team
 * @apiVersion 1.0.0
 * @apiDescription Registers a new team.
 *
 * @apiUse TeamInRequestBody
 * @apiUse TeamInResponseBody
 * @apiUse PlayerValidationError
 * @apiSuccess (Response body) {String} id A unique identifier for the team generated by the server
 *
 * @apiExample Example
 *     POST /api/team HTTP/1.1
 *     Content-Type: application/json
 *
 *    {
 *       "players": [
 *           "111154f23437342a74ffe124",
 *           "333154f23437342a74ffe124",
 *           "333454f23437342a74ffe124",
 *           "333154f23437342a74ffe124",
 *           "333154f23437342a74ffe124",
 *           "333154f23437342a74ffe124"
 *       ],
 *       "_id": "5dc1767576846e18643fe750",
 *       "name": "Orlando",
 *       "logo": "http://blabla"
 *   }
 *
 *
 * @apiSuccessExample 201 Created
 *     HTTP/1.1 201 Created
 *     Content-Type: application/json
 *     Location: https://e-sport-dev.herokuapp.com/api/teams/5dc1767576846e18643fe750
 *
 *    {
 *       "players": [
 *          "111154f23437342a74ffe124",
 *           "333154f23437342a74ffe124",
 *           "333454f23437342a74ffe124",
 *           "333154f23437342a74ffe124",
 *           "333154f23437342a74ffe124",
 *           "333154f23437342a74ffe124"
 *       ],
 *       "_id": "5dc1767576846e18643fe750",
 *       "name": "Orldando",
 *       "logo": "http://blabla",
 *       "__v": 5,
 *       "createdAt": "2019-11-11T14:19:21.593Z"
 *    }
 */
teamRouter.post('/', function (req, res, next) {

  new Team(req.body).save(function (err, savedTeam) {
    if (err) {
      return next(err);
    }

    res.send(savedTeam);
  });
});

/**
 * @api {get} /api/team/:id Retrieve a team
 * @apiName RetrieveTeam
 * @apiGroup Team
 * @apiVersion 1.0.0
 * @apiDescription Retrieves one team.
 *
 * @apiUse TeamIdInUrlPath
 * @apiUse TeamInResponseBody
 * @apiUse TeamNotFoundError
 *
 * @apiExample Example
 *     GET /api/team/5dc2ea214d7a71492043832d HTTP/1.1
 *
 * @apiSuccessExample 200 OK
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *
 *   {
 *       "players": [
 *           "111154f23437342a74ffe124",
 *           "333154f23437342a74ffe124",
 *           "333454f23437342a74ffe124",
 *           "333154f23437342a74ffe124",
 *           "333154f23437342a74ffe124",
 *           "333154f23437342a74ffe124"
 *       ],
 *       "_id": "5dc1767576846e18643fe750",
 *       "name": "Orldddando",
 *       "logo": "http://blabla",
 *       "__v": 5,
 *       "createdAt": "2019-11-11T14:19:21.593Z"
 *   }
 */
teamRouter.get('/:id',loadTeamFromParamsMiddleware, function (req, res, next) {

  res.send(req.team);
});

/**
 * @api {patch} /api/team/:id Partially update a team
 * @apiName PartiallyUpdateTeam
 * @apiGroup Team
 * @apiVersion 1.0.0
 * @apiDescription Partially updates a team's data
 * All properties are optional.
 *
 * @apiUse TeamIdInUrlPath
 * @apiUse TeamInRequestBody
 * @apiUse TeamInResponseBody
 * @apiUse TeamNotFoundError
 * @apiUse TeamValidationError
 * 
 *
 * @apiExample Example
 *     PATCH /api/team/5dc2ea214d7a71492043832d HTTP/1.1
 *     Content-Type: application/json
 *
 *     {
 *       "players": [
 *           "111154f23437342a74ffe124",
 *           "333154f23437342a74ffe124",
 *			        ]
 *     }
 *
 * @apiSuccessExample 200 OK
 *     HTTP/1.1 200 OK
 *     Content-Type: application/json
 *
 *	   {
 *	    "players": [
 *	        "111154f23437342a74ffe124",
 *	        "333154f23437342a74ffe124"
 *	    ],
 *	    "_id": "5dc1767576846e18643fe750",
 *	    "name": "Orldddando",
 *	    "logo": "http://blabla",
 *	    "__v": 6,
 *	    "createdAt": "2019-11-11T14:48:00.175Z"
 *	  }
 */
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
  
/**
 * @api {delete} /api/team/:id Delete a team
 * @apiName DeleteTeam
 * @apiGroup Team
 * @apiVersion 1.0.0
 * @apiDescription Permanently deletes a team.
 *
 * 
 * @apiUse TeamIdInUrlPath
 * @apiUse TeamNotFoundError
 *
 * @apiExample Example
 *     DELETE /api/team/5dc2ea214d7a71492043832d HTTP/1.1
 *
 * @apiSuccessExample 204 No Content
 *     HTTP/1.1 204 No Content
 */
teamRouter.delete('/:id', loadTeamFromParamsMiddleware, function (req, res, next) {

  req.team.remove(function (err) {
    if (err) {
      return next(err);
    }

    debug(`Deleted Team "${req.team.name}"`);
    res.sendStatus(204);
  });
});

/**
 * Middleware that loads the team corresponding to the ID in the URL path.
 * Responds with 404 Not Found if the ID is not valid or the team doesn't exist.
 */
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

/**
 * Responds with 404 Not Found and a message indicating that the team with the specified ID was not found.
 */
function TeamNotFound(res, teamId) {
  return res.status(404).type('text').send(`No team found with that ID ${teamId}`);
}

/**
 * @apiDefine TeamIdInUrlPath
 * @apiParam (URL path parameters) {String} id The unique identifier of the team to retrieve
 */

/**
 * @apiDefine TeamNotFoundError
 *
 * @apiError {Object} 404/NotFound No team was found corresponding to the ID in the URL path
 *
 * @apiErrorExample {json} 404 Not Found
 *     HTTP/1.1 404 Not Found
 *     Content-Type: text/plain
 *
 *     No team found with ID 58b4326f5e1def0123e97281
 */

/**
 * @apiDefine TeamInRequestBody
 * @apiParam (Request body) {String{3..150}} name The name of the team (must be unique)
 * @apiParam (Request body) {ObjectId} players The id's of the players in the team
 * @apiParam (Request body) {String} logo The logo of the team 
*/

/**
 * @apiDefine TeamInResponseBody
 * @apiSuccess (Response body) {String} name The name of the team (must be unique)
 * @apiSuccess (Response body) {ObjectId} players The id's of the players in the team
 * @apiSuccess (Response body) {String} logo The logo of the team
 * @apiSuccess (Response body) {Date} createdAt The date at which the player was registered
*/

/**
 * @apiDefine TeamValidationError
 *
 * @apiError {Object} 422/UnprocessableEntity Some of the team's properties are invalid
 *
 * @apiErrorExample {json} 422 Unprocessable Entity
 *     HTTP/1.1 422 Unprocessable Entity
 *     Content-Type: application/json
 *
 *     {
 *       "message": "Team validation failed",
 *       "errors": {
 *         "name": {
 *           "kind": "minlength",
 *           "message": "Path `name` (`0`) is shorter than the minimum allowed length (3).",
 *           "name": "ValidatorError",
 *           "path": "name",
 *           "properties": {
 *             "message": "Path `{PATH}` (`{VALUE}`) is shorter than the minimum allowed length (3).",
 *             "minlength": 3,
 *             "path": "name",
 *             "type": "minlength",
 *             "value": "0"
 *           },
 *           "value": "0"
 *         }
 *       }
 *     }
 */

module.exports = teamRouter;