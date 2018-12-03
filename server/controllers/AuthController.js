const jwt = require('jsonwebtoken');
const {JWT_SECRET, JWT_EXPIRY} = require('../config');

const User = require('../models/User');

const checkForRequiredFields = require('./helpers/checkForRequiredFields');

class AuthController {
    static createAuthToken(user) {
        return jwt.sign({ user }, JWT_SECRET, {
            subject: user.email,
            expiresIn: JWT_EXPIRY,
            algorithm: 'HS256'
        });
    }

    static authenticateUser(req, res) {
        const requiredFields = ['email', 'password'];
        const validate = checkForRequiredFields(requiredFields, req.body);

        if(validate) {
            res.status(400).send(validate);
        }

        User
            .find()
            .byEmail(req.body.email)
            .then((user) => {
                if(user.comparePasswords(req.body.password)) {
                    const userObj = user.serialize();
                    userObj.jwt = AuthController.createAuthToken(userObj);
                    res.status(200).send(JSON.stringify(userObj));
                } else {
                    res.status(403).send({message: 'Invalid email address or password.'});
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send({message: 'Internal server error.'});
            });
    }
}

module.exports = AuthController;