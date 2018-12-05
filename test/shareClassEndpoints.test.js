const chai = require('chai');
const chaiHttp = require('chai-http')
const app = require('../server/app');
const mongoose = require('mongoose');
const faker = require('faker');

const { runServer, closeServer } = require('../server/server');
const { TEST_DATABASE_URL, TEST_PORT, AUTH_BYPASS_HEADER } = require('../server/config');

// models
const Company = require('../server/models/Company');

const { expect } = chai;
chai.use(chaiHttp);

// import dummy data
const {testCompany, testShareClass} = require('./testData');

let classId; // this will be used later to compare that we can get the same object back by slug

describe('Share Class Endpoints', function () {
    // start server and add a company to the DB
    before(function (done) {
        runServer(TEST_DATABASE_URL, TEST_PORT)
            .then(() => {
                return Company.create(testCompany);
            })
            .then((company) => {
                done();
            });
    });

    // drop db and close server
    after(function (done) {
        mongoose.connection.dropDatabase()
            .then((dropped) => {
                return closeServer();
            })
            .then(() => {
                done();
            });
    });

    describe('/api/company/shareClass', function () {
        it('POST: should not add a share class when a required parameter is missing', function(done) {
            let {classSlug, ...incomplete} = testShareClass;
            chai.request(app)
                .post('/api/company/shareClass')
                .send(incomplete)
                .then((res) => {
                    expect(res).to.have.status(400);
                    let {className, ...incomplete} = testShareClass;
                    return chai.request(app)
                        .post('/api/company/shareClass')
                        .send(incomplete);
                })
                .then((res) => {
                    expect(res).to.have.status(400);
                    let {currentlyOffered, ...incomplete} = testShareClass;
                    return chai.request(app)
                        .post('/api/company/shareClass')
                        .send(incomplete);
                })
                .then((res) => {
                    expect(res).to.have.status(400);
                    let { authedShares, ...incomplete } = testShareClass;
                    return chai.request(app)
                        .post('/api/company/shareClass')
                        .send(incomplete);
                })
                .then((res) => {
                    expect(res).to.have.status(400);
                    let { reservedShares, ...incomplete } = testShareClass;
                    return chai.request(app)
                        .post('/api/company/shareClass')
                        .send(incomplete);
                })
                .then((res) => {
                    expect(res).to.have.status(400);
                    let { currentPrice, ...incomplete } = testShareClass;
                    return chai.request(app)
                        .post('/api/company/shareClass')
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
        })
        it('POST: should add a share class', function(done) {
            chai.request(app)
                .post('/api/company/shareClass')
                .send(testShareClass)
                .then((res) => {
                    classId = res.body.id;
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('id');
                    expect(res.body.classSlug).to.equal(testShareClass.classSlug);
                    expect(res.body.className).to.equal(testShareClass.className);
                    expect(res.body.currentlyOffered).to.equal(testShareClass.currentlyOffered);
                    expect(res.body.authedShares).to.equal(testShareClass.authedShares);
                    expect(res.body.reservedShares).to.equal(testShareClass.reservedShares);
                    expect(res.body.currentPrice).to.equal(testShareClass.currentPrice);
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done(err);
                })
        });
        it('POST: should not add a share class with a duplicate slug', function(done) {
            chai.request(app)
                .post('/api/company/shareClass')
                .send(testShareClass)
                .then((res) => {
                    expect(res).to.have.status(400);
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done(err);
                });
        })
        it('GET: should get all share classes', function(done) {
            chai.request(app)
                .get('/api/company/shareClass')
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an.instanceOf(Array);
                    expect(res.body[0]).to.have.property('classData');
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done(err);
                });
        })
    });

    describe('/api/company/shareClass/:classSlug', function() {
        it('GET: should get a shareClass with the provided slug', function(done) {
            chai.request(app)
                .get(`/api/company/shareClass/${testShareClass.classSlug}`)
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.id).to.equal(classId);
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done(err);
                });
        });
        const newTestShareClass = {
            className: faker.commerce.productName(),
            classSlug: testShareClass.classSlug,
            currentlyOffered: faker.random.boolean(),
            authedShares: faker.random.number({ min: 1, max: 1000000000 }),
            reservedShares: faker.random.number({ min: 0, max: this.authedShares }),
            currentPrice: faker.random.number({ min: 1, max: 50 })
        };
        it('PUT: should update updatable fields in a share class', function(done) {
            chai.request(app)
                .put(`/api/company/shareClass/${testShareClass.classSlug}`)
                .send(newTestShareClass)
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.classSlug).to.equal(testShareClass.classSlug);
                    expect(res.body.className).to.equal(testShareClass.className);
                    expect(res.body.currentlyOffered).to.equal(newTestShareClass.currentlyOffered);
                    expect(res.body.authedShares).to.equal(newTestShareClass.authedShares);
                    expect(res.body.reservedShares).to.equal(newTestShareClass.reservedShares);
                    expect(res.body.currentPrice).to.equal(newTestShareClass.currentPrice);
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done(err);
                });
        });
        it('PUT: should not update share class if slug does not match url param', function(done) {
            chai.request(app)
                .put(`/api/company/shareClass/${faker.lorem.word()}`)
                .send(newTestShareClass)
                .then((res) => {
                    expect(res).to.have.status(400);
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done(err);
                });
        });
        it('PUT: should not update share class if slug is not present in request body', function(done) {
            delete newTestShareClass.classSlug;
            chai.request(app)
                .put(`/api/company/shareClass/${testShareClass.classSlug}`)
                .send(newTestShareClass)
                .then((res) => {
                    expect(res).to.have.status(400);
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done(err);
                });
        })
    });
});