const WebSocket = require('ws');
const express = require('express');


const Tournament = require('./models/tournament');
const Team = require('./models/team');

const players = [];

const jwt = require('jsonwebtoken');
//function creating a running websocket server
exports.createWebsocketBackend = function(server) {

  const wss = new WebSocket.Server({
    server
  });


// Put player in an array to know who to send the message
 wss.on('connection', function(ws) {
    
/*
    ws.on('authenticate', function (data) {
        jwt.verify(data.token, secretKey, function(err, payload) {
		    if (err) {
		      return res.status(401).send('Your token is invalid or has expired');
		    } else {
		      req.currentUserId = payload.sub;
		      next(); // Pass the ID of the authenticated user to the next middleware.
		    }
  		});
    });
  */
    	players.push(ws);
    	availableTournament();
    	availableTeam();


    ws.on('close', function() {
    	
		function isPlayer(el) {
		  return el === ws;
		}

		players.splice(players.findIndex(isPlayer), 1);
    });

  });


};


// Function who send avaible tournaments at the creation or delete of one to the array of players connected
availableTournament = function() {

	function createMessage(TotalTournament, TournamentBody) {
		let message = {
			TotalTournament: TotalTournament,
			TournamentBody: TournamentBody
			};
		 return message; 
	};

	async function getMessage() {

		let TotalTournament = await Tournament.find().count();
		let TournamentBody = await Tournament.find();
		let message = createMessage(TotalTournament, TournamentBody);

		return message;
	};

	getMessage()
		.then(function(message){
			players.forEach(function(player){
				player.send(JSON.stringify(message));
			});
		});

}; 

// Function who send avaible teams at the creation or delete of one to the array of players connected
availableTeam = function() {

	function createMessage(TotalTeam, TeamBody) {
		let message = {
			TotalTeam: TotalTeam,
			TeamBody: TeamBody
			};
		 return message; 
	};

	async function getMessage() {

		let TotalTeam = await Team.find().count();
		let TeamBody = await Team.find();
		let message = createMessage(TotalTeam, TeamBody);

		return message;
	};

	getMessage()
		.then(function(message){
			players.forEach(function(player){
				player.send(JSON.stringify(message));
			});
		});

}; 

module.exports.availableTournament = availableTournament;
module.exports.availableTeam = availableTeam;