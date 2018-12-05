const chai = require('chai');
const chaiHttp = require('chai-http')
const app = require('../server/app');
const mongoose = require('mongoose');

const { runServer, closeServer } = require('../server/server');
const { TEST_DATABASE_URL, TEST_PORT, AUTH_BYPASS_HEADER } = require('../server/config');

// models
const User = require('../server/models/User');

const { expect } = chai;
chai.use(chaiHttp);

// import test data
const {testUser} = require('./testData');

let userId;

describe('User Endpoints', function () {
    // start server
    before(function () {
        return runServer(TEST_DATABASE_URL, TEST_PORT)
            .then(() => {
            });
    });

    // drop db and close server
    after(function () {
        return mongoose.connection.dropDatabase()
            .then((dropped) => {
                if (dropped) {
                    return closeServer();
                } else {
                    throw new Error('database not dropped');
                }
            })
    });

    describe.only('/api/users', function () {
        it('POST: should create a user', function(done) {
            chai.request(app)
                .post('/api/users')
                .send(testUser)
                .then((res) => {
                    userId = res.body.id;
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('id');
                    expect(res.body.email.toLowerCase()).to.equal(testUser.email.toLowerCase());
                    expect(res.body.name).to.equal(`${testUser.firstName} ${testUser.lastName}`);
                    return User.findById(userId);
                })
                .then((user) => {
                    expect(user.comparePasswords(testUser.password)).to.be.true;
                    done();
                })
                .catch(err => {
                    console.error(err);
                });
        });
        it('GET: should get all users', function(done) {
            chai.request(app)
                .get('/api/users')
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.users).to.be.an.instanceof(Array);
                    expect(res.body.users[0].id).to.equal(userId);
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done(err);
                });
        });
    });
    describe.only('/api/users/byId/:id', function() {
        it('GET: should get a user by id', function(done) {
            chai.request(app)
                .get(`/api/users/byId/${userId}`)
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.id).to.equal(userId);
                    expect(res.body.email.toLowerCase()).to.equal(testUser.email.toLowerCase());
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done(err);
                });
        });
    });
    describe.only('/api/users/byEmail/:email', function () {
        it('GET: should get a user by email', function (done) {
            chai.request(app)
                .get(`/api/users/byEmail/${testUser.email}`)
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.id).to.equal(userId);
                    expect(res.body.email.toLowerCase()).to.equal(testUser.email.toLowerCase());
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done(err);
                });
        });
    });
});