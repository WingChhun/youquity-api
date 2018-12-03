const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const issuedSharesSchema = require('./IssuedShares');
const shareClassSchema = require('./ShareClass');

const companySchema = mongoose.Schema({
    name: {type: String, required: true, trim: true},
    shareClasses: [shareClassSchema],
    investmentData: {
        issued: [issuedSharesSchema],
        pending: []
    }
});



companySchema.methods.serialize = function() {

}

const Company = mongoose.model('Company', companySchema);