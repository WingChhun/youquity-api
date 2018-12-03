const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const bcrypt = require('bcryptjs');

const isEmail = require('validator').isEmail;

const userSchema = mongoose.Schema({
    name: {
        first: { type: String, required: true, trim: true },
        last: { type: String, required: true, trim: true},
    },
    email: { type: String, required: 'An email address is required.', index: true, trim: true, lowercase: true, unique: true, validate: [isEmail, 'Please enter a valid email address.'] },
    password: {type: String, required: true}
});

/////// VIRTUALS ///////
userSchema.virtual('fullName').get(function () {
    return `${this.name.first} ${this.name.last}`;
});

/////// METHODS ///////
userSchema.methods.serialize = function () {
    return {
        id: this._id,
        name: this.fullName,
        email: this.email
    }
};

userSchema.methods.comparePasswords = function(plainTextPass) {
    return bcrypt.compareSync(plainTextPass, this.password);
} 

/////// QUERIES ///////
userSchema.query.byEmail = function (email) {
    return this.findOne({ email: new RegExp(email, 'i') });
}

const User = mongoose.model('User', userSchema);

module.exports = User;