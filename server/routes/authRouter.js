const express = require('express');
const bodyParser = require('body-parser');

const AuthController = require('../controllers/AuthController');

const router = express.Router();

router.use(bodyParser.json());

router.post('/login', AuthController.authenticateUser);

module.exports = router;