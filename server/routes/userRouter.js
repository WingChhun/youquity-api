const express = require('express');
const bodyParser = require('body-parser');

const UserController = require('../controllers/UserController');

const router = express.Router();

router.use(bodyParser.json());

router.post('/', UserController.createUser);
router.get('/', UserController.getAllUsers);
router.get('/byId/:id', UserController.getUserById);
router.get('/byEmail/:email', UserController.getUserByEmail);

module.exports = router;