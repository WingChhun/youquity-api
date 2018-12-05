const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server/app');

const {expect} = chai;
chai.use(chaiHttp);

const genericObject = {param1: 'param', param2: 'param'};
const urlBase = '/api/';
const get = 'get';
const put = 'put';
const post = 'post';
const del = 'del';
const protectedEndpoints = [
    {
        url: `${urlBase}company/`,
        verb: get
    },
    {
        url: `${urlBase}company/`,
        verb: post
    },
    {
        url: `${urlBase}company/shareClass`,
        verb: post
    },
    {
        url: `${urlBase}company/shareClass`,
        verb: get
    },
    {
        url: `${urlBase}company/shareClass/fakeslug`,
        verb: get
    },
    {
        url: `${urlBase}company/shareClass/fakeslug`,
        verb: put
    },
    {
        url: `${urlBase}company/shares/pending`,
        verb: post
    },
    {
        url: `${urlBase}company/shares/pending`,
        verb: get
    },
    {
        url: `${urlBase}company/shares/pending/jkljkljkljkl`,
        verb: get
    },
    {
        url: `${urlBase}company/shares/pending/jkljkljkljkl`,
        verb: put
    },
    {
        url: `${urlBase}company/shares/pending/jkljkljkljkl`,
        verb: del
    },
    {
        url: `${urlBase}company/shares/issued`,
        verb: post
    },
    {
        url: `${urlBase}company/shares/issued`,
        verb: get
    },
    {
        url: `${urlBase}company/shares/issued/jkljkljkljkl`,
        verb: get
    },
    {
        url: `${urlBase}users`,
        verb: get
    },
    {
        url: `${urlBase}users/byId/jkljkljkljkl`,
        verb: get
    },
    {
        url: `${urlBase}users/byEmail/test@test.com`,
        verb: get
    }
];

const endpointRequests = {
    get: function(url) {
        return chai.request(app).get(url);
    },
    put: function(url) {
        return chai.request(app).put(url).send(genericObject);
    },
    post: function(url) {
        return chai.request(app).post(url).send(genericObject);
    },
    del: function(url) {
        return chai.request(app).delete(url);
    }
};


describe('Endpoint Authorization', function() {
    for(i = 0; i < protectedEndpoints.length; i++) {
        let {url, verb} = protectedEndpoints[i];
        let func = endpointRequests[verb];

        it(`${verb.toUpperCase()} ${url}`, function(done) {
            func(url)
                .then((res) => {
                    expect(res).to.have.status(401);
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done(err);
                });
        });
    }
});