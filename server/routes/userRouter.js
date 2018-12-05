const express = require('express');
const bodyParser = require('body-parser');

const UserController = require('../controllers/UserController');

const jwtAuth = require('../middleware/jwtAuth');

const router = express.Router();

router.use(bodyParser.json());

router.post('/', UserController.createUser);
router.get('/', jwtAuth, UserController.getAllUsers);
router.get('/byId/:id', jwtAuth, UserController.getUserById);
router.get('/byEmail/:email', jwtAuth, UserController.getUserByEmail);

module.exports = router;