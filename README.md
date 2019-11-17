## E-Sport-Dev esport API

A RESTful API implemented with [Express](http://expressjs.com/). This application was done in the ArchioWeb taught at [HEIG-VD](https://heig-vd.ch/) by Elisa Biver, Lucien Pochon and Adrien Lestuzzi.

### Requirements
- [Node.js](https://nodejs.org/en/)12.x
- [MongoDB](https://www.mongodb.com/)4.x

### Usage
' git clone git@github.com:alestuzzi/e-sport-dev.git '
' cd e-sport-dev '
' npm start '

Visit [https://e-sport-dev.herokuapp.com/](https://e-sport-dev.herokuapp.com/)

### Configuration

The app will attempt to connect to the MongoDB database at mongodb://localhost/esport by default.

Use the $DATABASE_URL or the $MONGODB_URI environment variables to specify a different connection URL.

### Resources

This API allows you to work with Players, Tournaments and Teams:

Read the full [documentation](aUpdate) to know more.
