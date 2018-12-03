const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const issuedSharesSchema = mongoose.Schema({
    certificateNum: {type: Number, required: true},
    certificateTitle: {type: String, required: true, trim: true},
    numShares: {type: Number, required: true},
    pricePerShare: {type: Number, required: true},
    purchaseDate: {type: Date, required: true},
    shareClassSlug: {type: String, required: true, trim: true},
    issueDate: {type: Date, required: true}
});

issuedSharesSchema.methods.serialize = function () {
    return {
        id: this._id,
        certificateNum: this.certificateNum,
        certificateTitle: this.certificateTitle,
        numShares: this.numShares,
        pricePerShare: this.pricePerShare,
        purchaseDate: this.purchaseDate,
        shareClassSlug: this.shareClassSlug,
        issueDate: this.issueDate,
    }
}

// only export the schema because this will only
// be used as a nested sub-document
module.exports = issuedSharesSchema;