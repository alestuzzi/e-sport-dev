# E-Sport-Dev esport API

A RESTful API implemented with [Express](http://expressjs.com/). This application was done in the ArchioWeb taught at [HEIG-VD](https://heig-vd.ch/) by Elisa Biver, Lucien Pochon and Adrien Lestuzzi.


## Requirements
- [Node.js](https://nodejs.org/en/)12.x
- [MongoDB](https://www.mongodb.com/)4.x

## Usage
```
git clone git@github.com:alestuzzi/e-sport-dev.git
cd e-sport-dev
npm ci
npm start
```

Visit [[http://localhost:3000](http://localhost:3000)]

To automatically reload the code and re-generate the API documentation on changes, use `npm run dev` instead of `npm start`.

## Configuration

The app will attempt to connect to the MongoDB database at mongodb://localhost/esport by default.

Use the $DATABASE_URL or the $MONGODB_URI environment variables to specify a different connection URL.

## Resources

This goal is to have a RESTful API who can be utiliized to manage multiple tournaments with multiple team who could have multiple players.

This API allows you to work with Players, Tournaments and Teams:

You can: 

* POST, GET, PATCH or DELETE a player
* POST, GET, PATCH or DELETE a team
* POST, GET, PATCH or DELETE a tournament
* GET a list of all players, team or tournament
* GET a list of player with the same age and/or the gender of the player
* Get a aggredated data with the average age of players  
* Register / Authenticate to the API


## Documentation 

The full [documentation](https://e-sport-dev.herokuapp.com/) is available at the index of our app. 

### Websocket Documentation - Real-time component

The app is build with a [Websocket endpoint](ws://e-sport-dev.herokuapp.com/3000) which a plain WebSockets client can connect to receive real-time messages. 

if you work on your local machine you can use this: 
```
ws://localhost:3000/
```
Here is a exemple of a [web client for websocket](https://msg-central.herokuapp.com/ws)

The real time service send the number of tournament and teams build with the content of their datas.

In the dispatcher `disposer.js` we create a server : 

```
exports.createWebsocketBackend = function(server) {

  const wss = new WebSocket.Server({
    server
  });
```
We instance it in `bin/www`


In `disposer.js` we use :  

* `availableTeam()` count and retrieve the content of all the teams in the DB
* `availableTournament()` count and retrive the content of all the tournaments in the DB 


The message will be send when: 
 * The user connect to the service
 * A team is created or deleted
 * A tournament is created or deleted 

The message format is generated in JSON, like this :
```
{
  "TotalTeam": 2,
  "TeamBody": [
    {
      "players": [
        "111154f23437342a74ffe129",
        "333154f23437342a74ffe124"
      ],
      "_id": "5dc1767576846e18643fe750",
      "name": "Orlando",
      "logo": "http://logo.jpg",
      "__v": 0,
      "createdAt": "2019-11-11T14:48:00.175Z"
    },
    {
      "players": [
        "432154f23437342a0453e122",
        "167154f23434545644ffe123",
        "112342323437342a74ffe142"
      ],
      "_id": "5dd05899e7499470fc56ede8",
      "name": "New York Eagle",
      "logo": "http://logo.jpg",
      "createdAt": "2019-11-16T20:14:17.852Z",
      "__v": 0
    },
 -------------------------------------------------
{
  "TotalTournament": 1,
  "TournamentBody": [
    {
      "teams": [
        "5dc1767576846e18643fe750",
        "5dd05899e7499470fc56ede8"
      ],
      "_id": "5dc184d385974541b4d10664",
      "name": "Tournament Winners",
      "__v": 0,
      "createdAt": "2019-11-18T15:27:46.741Z"
    }
```

#### Useful links 

* [Documentation](https://e-sport-dev.herokuapp.com/)
* [Express](https://expressjs.com)
* [Mongo](https://www.mongodb.com)
* [Node](https://nodejs.org/)
* [NPM](https://docs.npmjs.com/)
* [POSTMAN (can send request to test API)](https://www.getpostman.com/downloads/)

