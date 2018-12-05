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

const testPendingInvestment = {
    certificateTitle: faker.name.findName(),
    numShares: faker.random.number({min: 1000, max: 50000}),
    shareClassSlug: testShareClass.classSlug,
    requestDate: faker.date.between('2018-06-01', '2018-12-01'),
    subsAgmt: faker.random.boolean(),
    pymtRecd: faker.random.boolean()
};

const testUpdatedPendingInvestment = {
    certificateTitle: faker.name.findName(),
    numShares: faker.random.number({ min: 1000, max: 50000 }),
    shareClassSlug: faker.lorem.word(),
    requestDate: faker.date.between('2018-06-01', '2018-12-01'),
    workflow: {
        subsAgmt: faker.random.boolean(),
        pymtRecd: faker.random.boolean()
    }
};

const testIssuedInvestment = {
    certificateTitle: faker.name.findName(),
    numShares: faker.random.number({ min: 1000, max: 50000 }),
    shareClassSlug: testShareClass.classSlug,
    purchaseDate: faker.date.between('2018-06-01', '2018-12-01'),
    issueDate: faker.date.between('2018-12-01', '2018-12-05'),
    certificateNum: faker.random.number({min: 100, max: 500}),
    pricePerShare: faker.random.number({min: 1, max: 50})
};

const testUser = {
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: faker.internet.password()
};

module.exports = {testCompany, testShareClass, testPendingInvestment, testIssuedInvestment, testUpdatedPendingInvestment, testUser};