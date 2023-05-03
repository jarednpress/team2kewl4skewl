// Imports the index.js file to be tested.
const server = require('../index'); //TO-DO Make sure the path to your index.js is correctly added
// Importing libraries

// Chai HTTP provides an interface for live integration testing of the API's.
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome_test')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });

it('positive : /login success', done => {
  chai
    .request(server)
    .post('/login')
    .send({username: 'asdf', password: 'asdf'})
    .end((err, res) => {
      expect(res.text).to.contain('<title>Login</title>');
      expect(res).to.have.status(200);
      done();
    });
});

it('Negative : /login. Checking invalid name, redirect to register', done => {
  chai
    .request(server)
    .post('/login')
    .send({username: 'not real', password: 'not real'})
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res).to.have.header('content-type','text/html; charset=utf-8');
      expect(res.text).to.contain('<title>Register</title>'); //for res.render change to title of page
      done();
    });
});

it('positive : /register success', done => {
  chai
    .request(server)
    .post('/register')
    .send({username: 'StupidUserName', password: 'EasyPassWord'})
    .end((err, res) => {
      expect(res.text).to.contain('<title>Login</title>');
      expect(res).to.have.status(200);
      done();
    });
});
it('Negative : /register Username Already Taken', done => {
  chai
    .request(server)
    .post('/register')
    .send({username: 'asdf', password: 'asdf'})
    .end((err, res) => {
      expect(res.text).to.contain('<title>Register</title>');
      expect(res).to.have.status(200);
      done();
    });
});
it('test : /playlist without auth', done => {
  chai
    .request(server)
    .post('/playlist')
    .send({from: 'Boulder, CO, USA', to: 'Denver, CO, USA'})
    .end((err, res) => {
      expect(res.text).to.contain('<title>Login</title>');
      expect(res).to.have.status(200);
      done();
    });
});
  // ===========================================================================
  // TO-DO: Part A Login unit test case
});