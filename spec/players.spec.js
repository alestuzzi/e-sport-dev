const app = require('../app');
const jwt = require('jsonwebtoken');
const supertest = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const { cleanUpDatabase } = require('./utils');
const Player = require('../models/user');
const secretKey = process.env.SECRET_KEY || 'changeme';

beforeEach(cleanUpDatabase);

describe('POST /api/player', function() {


  it('should create a player', async function() {

  	const res = await supertest(app)
	  .post('/api/player')
	  .send({
	    firstName: 'John',
	    lastName: 'Doe',
	    pseudo: 'JDO',
	    password: 'changeme',
	    birthDate: '1997-03-28T00:00:00.000Z',
	    picture: 'https://picture',
	    gender: 'male'


	  })
	  .expect(200)
	  .expect('Content-Type', /json/);

	  expect(res.body).to.be.an('object');
	  expect(res.body._id).to.be.a('string');
	  expect(res.body.firstName).to.equal('John');
	  expect(res.body.lastName).to.equal('Doe');
	  expect(res.body.pseudo).to.equal('JDO');
	  expect(res.body.birthDate).to.equal('1997-03-28T00:00:00.000Z');
	  expect(res.body.picture).to.equal('https://picture');
	  expect(res.body.gender).to.equal('male');
      expect(res.body).to.have.all.keys('_id', 'firstName','lastName','pseudo','gender', 'birthDate', 'picture','createdAt', '__v');
    });
});




describe('GET /api/players', function() {

	beforeEach(async function() {
    // Create 2 palyers before retrieving the list.
	    await Promise.all([
	      Player.create({ firstName: 'John', lastName: 'Doe', pseudo: 'JDO', password: 'changeme', birthDate: '1997-03-28T00:00:00.000Z', picture: 'https://picture', gender: 'male'  }),
	      Player.create({ firstName: 'Jane', lastName: 'Doe', pseudo: 'JDA', password: 'changeme', birthDate: '1997-03-28T00:00:00.000Z', picture: 'https://picture', gender: 'female'  }),
	    ]);
   	});

    it('should retrieve the list of players', async function() {

  	const res = await supertest(app)
	  .get('/api/player')
	  .expect(200)
	  .expect('Content-Type', /json/);

	  expect(res.body).to.be.an('array');
	  expect(res.body).to.have.lengthOf(2);

	  expect(res.body[0]).to.be.an('object');
	  expect(res.body[0]._id).to.be.a('string');
	  expect(res.body[0].firstName).to.equal('Jane');
	  expect(res.body[0].lastName).to.equal('Doe');
	  expect(res.body[0].pseudo).to.equal('JDA');
	  expect(res.body[0].birthDate).to.equal('1997-03-28T00:00:00.000Z');
	  expect(res.body[0].picture).to.equal('https://picture');
	  expect(res.body[0].gender).to.equal('female');
      expect(res.body[0]).to.have.all.keys('_id', 'firstName','lastName','pseudo','gender', 'birthDate', 'picture','createdAt', '__v');

	  expect(res.body[1]).to.be.an('object');
	  expect(res.body[1]._id).to.be.a('string');
	  expect(res.body[1].firstName).to.equal('John');
	  expect(res.body[1].lastName).to.equal('Doe');
	  expect(res.body[1].pseudo).to.equal('JDO');
	  expect(res.body[1].birthDate).to.equal('1997-03-28T00:00:00.000Z');
	  expect(res.body[1].picture).to.equal('https://picture');
	  expect(res.body[1].gender).to.equal('male');
      expect(res.body[1]).to.have.all.keys('_id', 'firstName','lastName','pseudo','gender', 'birthDate', 'picture','createdAt', '__v');
    });
});



describe('PATCH /api/player/:id', function() {

	let player;
	let user_jwt;

    beforeEach(async function() {
   // Create 1 player before updating it.
 	player = await Player.create({firstName: 'John', lastName: 'Doe', pseudo: 'JDO', password: 'changeme', birthDate: '1997-03-28T00:00:00.000Z', picture: 'https://picture', gender: 'male'  });
	
         
 
    });

  it('should update a player', async function() {

  	
	const exp = (new Date().getTime() + 7 * 24 * 3600 * 1000) / 1000;
     const claims = { sub: player._id.toString(), exp: exp };


       user_jwt = jwt.sign(claims, secretKey);



  	const res = await supertest(app)

	  .patch('/api/player/'+player._id)
	  .set('Authorization', 'Bearer' + user_jwt)
	  .send({
	    firstName: 'Bobby',
	    lastName: 'Singer',
	  })
	  .expect(200)
	  .expect('Content-Type', /json/);


	  expect(res.body).to.be.an('object');
	  expect(res.body._id).to.be.a('string');
	  expect(res.body.firstName).to.equal('Bobby');
	  expect(res.body.lastName).to.equal('Singer');
	  expect(res.body.pseudo).to.equal('JDO');
	  expect(res.body.birthDate).to.equal('1997-03-28T00:00:00.000Z');
	  expect(res.body.picture).to.equal('https://picture');
	  expect(res.body.gender).to.equal('male');
      expect(res.body).to.have.all.keys('_id', 'firstName','lastName','pseudo','gender', 'birthDate', 'picture','createdAt', '__v');
    });
});


describe('DELETE /api/player/:id', function() {


 
	let player;
	let user_jwt;

  beforeEach(async function() {



   // Create 1 player before deleting it.
		 player = await Player.create({firstName: 'John',
		 							    lastName: 'Doe',
		 							    pseudo: 'JDO', 
		 							    password: 'changeme', 
		 							    birthDate: '1997-03-28T00:00:00.000Z', 
		 							    picture: 'https://picture', 
		 							    gender: 'male'  });
	
         
  });


  it('should delete a player', async function() {

	 const exp = (new Date().getTime() + 1 * 24 * 3600 * 1000) / 1000;
      const claims = { sub: player._id.toString(), exp: exp };


      user_jwt = jwt.sign(claims, secretKey);

  	const res = await supertest(app)
	  .delete('/api/player/'+player._id)
	  .set('Authorization', 'Bearer' + user_jwt)
	  .expect(204)



	  expect(res.body).eql({})
    });
});



after(mongoose.disconnect);
