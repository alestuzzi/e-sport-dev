var express = require('express');

const playerRouter = express.Router();

playerRouter.get('/', function (req, res, next) {
    // affichage de tous les joueurs
    User.find().sort('pseudo').exec(function(err, users) {
        if (err) {
          return next(err);
        }
        res.send(users);
      });
});

playerRouter.post('/', function (req, res, next) {
// ajout d'un nouveau joueur
  
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
// affichage d'un joueur spécifique
  
});

playerRouter.patch('/:id', function (req, res, next) {
// modification partielle d'un joueur
  
});

playerRouter.delete('/:id', function (req, res, next) {
// suppression complète d'un joueur
  
});


module.exports = playerRouter;