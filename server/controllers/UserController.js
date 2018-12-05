const User = require('../models/User');

const bcrypt = require('bcryptjs');

const checkForRequiredFields = require('./helpers/checkForRequiredFields');

class UserController {
    static hashPassword(password) {
        return bcrypt.hashSync(password, 10);
    }

    static createUser(req, res) {
        
        const requiredFields = ['email', 'firstName', 'lastName', 'password'];

        const validate = checkForRequiredFields(requiredFields, req.body);
        
        if (validate) {
            res.status(400).send(validate);
            return;
        }

        User
            .create({
                name: {
                    first: req.body.firstName,
                    last: req.body.lastName
                },
                email: req.body.email,
                password: UserController.hashPassword(req.body.password)
            })
            .then((user) => {
                res.status(201).json(user.serialize());
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Internal server error.' });
            });
    }

    static getAllUsers(req, res) {
        User
            .find()
            .then(users => {
                res.json({
                    users: users.map(
                        user => user.serialize()
                    )
                });
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Internal server error.' });
            });
    }

    static getUserById(req, res) {
        User
            .findById(req.params.id)
            .then(user => res.json(user.serialize()))
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Internal server error' });
            });
    }

    static getUserByEmail(req, res) {
        User
            .find()
            .byEmail(req.params.email)
            .then((user) => {
                if (user) {
                    return res.json(user.serialize());
                } else {
                    return res.status(204).end();
                }
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Internal server error' });
            });
    }
}

module.exports = UserController;