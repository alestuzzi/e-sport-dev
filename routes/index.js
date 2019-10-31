var express = require('express');
var router = express.Router();

/**
 * @api {get} /index Request all the informations on the database
 * @apiName GetUser
 * @apiGroup Index
 *
 * @apiSuccess {String} firstName First name of the user
 * @apiSuccess {String} lastName  Last name of the user
 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
