const jwt = require('jsonwebtoken');
const {JWT_SECRET, JWT_EXPIRY} = require('../config');
const jwtDecode = require('jwt-decode');

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
            return;
        }

        User
            .find()
            .byEmail(req.body.email)
            .then((user) => {
                if(user) {
                    if(user.comparePasswords(req.body.password)) {
                        const userObj = user.serialize();
                        const jwt = AuthController.createAuthToken(userObj);
                        res.status(200).json({jwt: jwt});
                    } else {
                        res.status(401).send({message: 'Invalid email address or password.'});
                    }
                } else {
                    res.status(401).send({ message: 'Invalid email address or password.' });
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send({message: 'Internal server error.'});
            });
    }

    static refreshToken(req, res) {
        const jwt = req.headers.authorization.split(' ')[1];
        const requiredFields = ['jwt'];
        const validate = checkForRequiredFields(requiredFields, {jwt});

        if (validate) {
            res.status(400).send(validate);
            return;
        }
        const user = jwtDecode(jwt).user;
        
        res.status(201).json({jwt: AuthController.createAuthToken(user)});
    }
}

module.exports = AuthController;