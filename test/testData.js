const faker = require('faker');

const testCompany = { name: faker.company.companyName() };

const testShareClass = {
    className: faker.commerce.productName(),
    classSlug: faker.lorem.word(),
    currentlyOffered: faker.random.boolean(),
    authedShares: faker.random.number({ min: 1, max: 1000000000 }),
    reservedShares: faker.random.number({ min: 0, max: this.authedShares }),
    currentPrice: faker.random.number({ min: 1, max: 50 })
};

module.exports = {testCompany, testShareClass};