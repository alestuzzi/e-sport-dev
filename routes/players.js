var express = require('express');

const playerRouter = express.Router();

playerRouter.get('/', function (req, res, next) {

  
});

playerRouter.post('/', function (req, res, next) {

  
});
/**
 * @api {get} /users/:id Request a user's information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Unique identifier of the user
 *
 * @apiSuccess {String} firstName First name of the user
 * @apiSuccess {String} lastName  Last name of the user
 */
playerRouter.get('/:id', function (req, res, next) {

  
});

playerRouter.patch('/:id', function (req, res, next) {

  
});

playerRouter.delete('/:id', function (req, res, next) {

  
});


module.exports = playerRouter;