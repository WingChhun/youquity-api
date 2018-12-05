const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const pendingSharesSchema = mongoose.Schema({
    certificateTitle: { type: String, required: true, trim: true },
    numShares: { type: Number, required: true },
    requestDate: { type: Date, required: true },
    shareClassSlug: { type: String, required: true, trim: true },
    workflow: {
        subsAgmt: {type: Boolean, required: true, default: false},
        pymtRecd: {type: Boolean, required: true, default: false}
    }
});

pendingSharesSchema.methods.serialize = function () {
    return {
        id: this._id,
        certificateTitle: this.certificateTitle,
        numShares: this.numShares,
        requestDate: this.requestDate,
        shareClassSlug: this.shareClassSlug,
        workflow: [
            {
                stepSlug: 'subsAgmt',
                stepName: 'Subscription Agreement Received',
                stepComplete: this.workflow.subsAgmt
            },
            {
                stepSlug: 'pymtRecd',
                stepName: 'Payment Received',
                stepComplete: this.workflow.pymtRecd
            }
        ]
    }
};

// only export the schema because this will only
// be used as a nested sub-document
module.exports = pendingSharesSchema;