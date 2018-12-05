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
const { testCompany, testShareClass, testPendingInvestment, testIssuedInvestment } = require('./testData');

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
    })
});