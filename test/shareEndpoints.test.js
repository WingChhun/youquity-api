const chai = require('chai');
const chaiHttp = require('chai-http')
const app = require('../server/app');
const mongoose = require('mongoose');

const { runServer, closeServer } = require('../server/server');
const { TEST_DATABASE_URL, TEST_PORT, AUTH_BYPASS_HEADER } = require('../server/config');

// models
const Company = require('../server/models/Company');

const { expect } = chai;
chai.use(chaiHttp);

// import dummy data
const { testCompany, testShareClass, testPendingInvestment, testIssuedInvestment, testUpdatedPendingInvestment } = require('./testData');

let pendingId, issuedId;

describe('Share Endpoints', function () {
    // start server and add a company to the DB
    before(function (done) {
        runServer(TEST_DATABASE_URL, TEST_PORT)
            .then(() => {
                return Company.create(testCompany);
            })
            .then((company) => {
                // add a share class
                company.shareClasses.push(testShareClass);
                return company.save();
            })
            .then(() => {
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

    describe('/api/company/shares/:type', function() {
        it('POST: should add a pending investment', function(done) {
            chai.request(app)
                .post('/api/company/shares/pending')
                .send(testPendingInvestment)
                .then((res) => {
                    pendingId = res.body.id;
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('id');
                    expect(res.body.certificateTitle).to.equal(testPendingInvestment.certificateTitle);
                    expect(res.body.numShares).to.equal(testPendingInvestment.numShares);
                    expect(res.body.shareClassSlug).to.equal(testPendingInvestment.shareClassSlug);
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done(err);
                });
        });
        it('POST: should not add a pending investment when required fields are missing', function(done) {
            let{certificateTitle, ...incomplete} = testPendingInvestment;
            chai.request(app)
                .post('/api/company/shares/pending')
                .send(incomplete)
                .then((res) => {
                    expect(res).to.have.status(400);
                    let {numShares, ...incomplete} = testPendingInvestment;
                    return chai.request(app)
                        .post('/api/company/shares/pending')
                        .send(incomplete);
                })
                .then((res) => {
                    expect(res).to.have.status(400);
                    let { shareClassSlug, ...incomplete } = testPendingInvestment;
                    return chai.request(app)
                        .post('/api/company/shares/pending')
                        .send(incomplete);
                })
                .then((res) => {
                    expect(res).to.have.status(400);
                    let { requestDate, ...incomplete } = testPendingInvestment;
                    return chai.request(app)
                        .post('/api/company/shares/pending')
                        .send(incomplete);
                })
                .then((res) => {
                    expect(res).to.have.status(400);
                    let { subsAgmt, ...incomplete } = testPendingInvestment;
                    return chai.request(app)
                        .post('/api/company/shares/pending')
                        .send(incomplete);
                })
                .then((res) => {
                    expect(res).to.have.status(400);
                    let { pymtRecd, ...incomplete } = testPendingInvestment;
                    return chai.request(app)
                        .post('/api/company/shares/pending')
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
        it('POST: should not add a pending investment when the share class does not exist', function(done) {
            const brokenTestPendingInvestment = {...testPendingInvestment};
            brokenTestPendingInvestment.shareClassSlug = 'myBrokenSlug';
            chai.request(app)
                .post('/api/company/shares/pending')
                .send(brokenTestPendingInvestment)
                .then((res) => {
                    expect(res).to.have.status(404);
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done(err);
                });
        });
        it('POST: should add an issued investment', function(done) {
            chai.request(app)
                .post('/api/company/shares/issued')
                .send(testIssuedInvestment)
                .then((res) => {
                    issuedId = res.body.id;
                    expect(res).to.have.status(201);
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done(err);
                });
        });
        it('POST: should not add an issued investment when required fields are missing', function (done) {
            let { certificateTitle, ...incomplete } = testIssuedInvestment;
            chai.request(app)
                .post('/api/company/shares/issued')
                .send(incomplete)
                .then((res) => {
                    expect(res).to.have.status(400);
                    let { numShares, ...incomplete } = testIssuedInvestment;
                    return chai.request(app)
                        .post('/api/company/shares/issued')
                        .send(incomplete);
                })
                .then((res) => {
                    expect(res).to.have.status(400);
                    let { shareClassSlug, ...incomplete } = testIssuedInvestment;
                    return chai.request(app)
                        .post('/api/company/shares/issued')
                        .send(incomplete);
                })
                .then((res) => {
                    expect(res).to.have.status(400);
                    let { certificateNum, ...incomplete } = testIssuedInvestment;
                    return chai.request(app)
                        .post('/api/company/shares/issued')
                        .send(incomplete);
                })
                .then((res) => {
                    expect(res).to.have.status(400);
                    let { pricePerShare, ...incomplete } = testIssuedInvestment;
                    return chai.request(app)
                        .post('/api/company/shares/issued')
                        .send(incomplete);
                })
                .then((res) => {
                    expect(res).to.have.status(400);
                    let { purchaseDate, ...incomplete } = testIssuedInvestment;
                    return chai.request(app)
                        .post('/api/company/shares/issued')
                        .send(incomplete);
                })
                .then((res) => {
                    expect(res).to.have.status(400);
                    let { issueDate, ...incomplete } = testIssuedInvestment;
                    return chai.request(app)
                        .post('/api/company/shares/issued')
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
        it('POST: should not add a pending investment when the share class does not exist', function (done) {
            const brokenTestIssuedInvestment = { ...testIssuedInvestment };
            brokenTestIssuedInvestment.shareClassSlug = 'myBrokenSlug';
            chai.request(app)
                .post('/api/company/shares/issued')
                .send(brokenTestIssuedInvestment)
                .then((res) => {
                    expect(res).to.have.status(404);
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done(err);
                });
        });
        it('GET: should get all pending investments', function(done) {
            chai.request(app)
                .get('/api/company/shares/pending')
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an.instanceof(Array);
                    expect(res.body[0].id).to.equal(pendingId);
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done(err);
                });
        });
        it('GET: should get all issued investments', function(done) {
            chai.request(app)
                .get('/api/company/shares/issued')
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an.instanceof(Array);
                    expect(res.body[0].id).to.equal(issuedId);
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done(err);
                });
        });
    });
    describe('/api/company/shares/:type/:id', function() {
        it('GET: should get a pending investment by id', function(done) {
            chai.request(app)
                .get(`/api/company/shares/pending/${pendingId}`)
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.id).to.equal(pendingId);
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done(err);
                });
        });
        it('GET: should get an issued investment by id', function(done) {
            chai.request(app)
                .get(`/api/company/shares/issued/${issuedId}`)
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.id).to.equal(issuedId);
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done(err);
                });
        });
        it('PUT: should update updatable fields in a pending investment', function(done) {
            const updatedPendingWithId = {id: pendingId, ...testUpdatedPendingInvestment};
            chai.request(app)
                .put(`/api/company/shares/pending/${pendingId}`)
                .send(updatedPendingWithId)
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.id).to.equal(pendingId);
                    expect(res.body.certificateTitle).to.equal(updatedPendingWithId.certificateTitle);
                    expect(res.body.numShares).to.equal(updatedPendingWithId.numShares);
                    expect(res.body.shareClassSlug).to.equal(updatedPendingWithId.shareClassSlug);
                    expect(res.body.workflow).to.be.an.instanceOf(Array);
                    for(i=0; i< res.body.workflow.length; i++) {
                        expect(res.body.workflow[i].stepComplete).to.equal(updatedPendingWithId.workflow[res.body.workflow[i].stepSlug]);
                    }
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done(err);
                });
        });
        it('PUT: should not update a pending investment if the id in the body does not match the url param', function(done) {
            const updatedPendingWithBadId = { id: issuedId, ...testUpdatedPendingInvestment };
            chai.request(app)
                .put(`/api/company/shares/pending/${pendingId}`)
                .send(updatedPendingWithBadId)
                .then((res) => {
                    expect(res).to.have.status(400);
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done(err);
                });
        });
        it('PUT: should not update pending investment if id is not specified in body', function(done) {
            chai.request(app)
                .put(`/api/company/shares/pending/${pendingId}`)
                .send(testUpdatedPendingInvestment)
                .then((res) => {
                    expect(res).to.have.status(400);
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done(err);
                });
        });
        it('DELETE: should delete a pending investment', function(done) {
            chai.request(app)
                .delete(`/api/company/shares/pending/${pendingId}`)
                .then((res) => {
                    expect(res).to.have.status(200);
                    return Company.findOne();
                })
                .then((company) => {
                    expect(company.investmentData.pending).to.be.an.instanceof(Array);
                    expect(company.investmentData.pending.length).to.equal(0);
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done(err);
                });
        });
    });
});