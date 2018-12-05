const chai = require('chai');
const chaiHttp = require('chai-http')
const app = require('../server/app');
const mongoose = require('mongoose');
const jwtDecode = require('jwt-decode');

const { runServer, closeServer } = require('../server/server');
const { TEST_DATABASE_URL, TEST_PORT, AUTH_BYPASS_HEADER } = require('../server/config');

// models
const User = require('../server/models/User');

const { expect } = chai;
chai.use(chaiHttp);

// import test data
const {testUser} = require('./testData');

let userId, jwt;

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

    describe('/api/users', function () {
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
                    
                    // login this user so we can authenticate
                    // the rest of the tests
                    return chai.request(app)
                        .post('/api/auth/login')
                        .send(testUser);
                })
                .then((res) => {
                    jwt = res.body.jwt;
                    done();
                })
                .catch(err => {
                    console.error(err);
                });
        });
        it('GET: should get all users', function(done) {
            chai.request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${jwt}`)
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
    describe('/api/users/byId/:id', function() {
        it('GET: should get a user by id', function(done) {
            chai.request(app)
                .get(`/api/users/byId/${userId}`)
                .set('Authorization', `Bearer ${jwt}`)
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
    describe('/api/users/byEmail/:email', function() {
        it('GET: should get a user by email', function(done) {
            chai.request(app)
                .get(`/api/users/byEmail/${testUser.email}`)
                .set('Authorization', `Bearer ${jwt}`)
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
    describe('/api/auth/login', function() {
        it('POST: should return jwt on successful authentication', function(done) {
            chai.request(app)
                .post('/api/auth/login')
                .set('Authorization', `Bearer ${jwt}`)
                .send(testUser)
                .then((res) => {
                    jwt = res.body.jwt;
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('jwt');
                    return jwtDecode(res.body.jwt);
                })
                .then((decodedJwt) => {
                    expect(decodedJwt.user.name).to.equal(`${testUser.firstName} ${testUser.lastName}`);
                    expect(decodedJwt.user.email.toLowerCase()).to.equal(testUser.email.toLowerCase());
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done(err);
                });
        });
        it('POST: should return an error if the email or password is missing', function(done) {
            let {email, ...incomplete} = testUser;
            chai.request(app)
                .post('/api/auth/login')
                .set('Authorization', `Bearer ${jwt}`)
                .send(incomplete)
                .then((res) => {
                    expect(res).to.have.status(400);
                    let {password, ...incomplete} = testUser;
                    return chai.request(app)
                        .post('/api/auth/login')
                        .send(incomplete);
                })
                .then((res) => {
                    expect(res).to.have.status(400);
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done(err);
                });
        });
        it('POST: should return an error if email or password is incorrect', function(done) {
            const broken = {...testUser};
            broken.email = 'broken@broken.broken';
            chai.request(app)
                .post('/api/auth/login')
                .set('Authorization', `Bearer ${jwt}`)
                .send(broken)
                .then((res) => {
                    expect(res).to.have.status(401);
                    const broken = {...testUser};
                    broken.password = 'wrong';
                    return chai.request(app)
                        .post('/api/auth/login')
                        .send(broken);
                })
                .then((res) => {
                    expect(res).to.have.status(401);
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done(err);
                });
        });
    });
    describe('/api/auth/refresh', function() {
        it('GET: should refresh token', function(done) {
            chai.request(app)
                .get('/api/auth/refresh')
                .set('Authorization', `Bearer ${jwt}`)
                .then((res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('jwt');
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done(err);
                });
        });
    });
});