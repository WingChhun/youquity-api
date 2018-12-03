const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const shareClassSchema = mongoose.Schema({
    classSlug: {type: String, required: true, trim: true},
    className: {type: String, required: true, trim: true},
    currentlyOffered: {type: Boolean, required: true},
    authedShares: {type: Number, required: true},
    reservedShares: {type: Number, required: true},
    currentPrice: {type: Number, required: true}
});

shareClassSchema.methods.serialize = function() {
    return {
        id: this._id,
        classSlug: this.classSlug,
        className: this.className,
        currentlyOffered: this.currentlyOffered,
        authedShares: this.authedShares,
        reservedShares: this.reservedShares,
        currentPrice: this.currentPrice
    }
}

// only export the schema because this will only
// be used as a nested sub-document
module.exports = shareClassSchema;