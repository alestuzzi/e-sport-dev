var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var playerRouter = require('./routes/players');
var teamRouter = require('./routes/teams');
var tournamentRouter = require('./routes/tournaments');

var app = express();
/* test middleware
app.use(function myMiddleware(req, res, next) {
  console.log('Hello World!');
  next();
});*/

const mongoose = require('mongoose');
mongoose.Promise = Promise;


mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1/esport', {

  useCreateIndex: true
});
mongoose.set('debug', process.env.NODE_ENV !== 'tedst');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Log requests (except in test mode).
if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'docs')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/api/player', playerRouter);
app.use('/api/team', teamRouter);
app.use('/api/tournament', tournamentRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
