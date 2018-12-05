const express = require('express');
const bodyParser = require('body-parser');

const AuthController = require('../controllers/AuthController');

const jwtAuth = require('../middleware/jwtAuth');

const router = express.Router();

router.use(bodyParser.json());

router.post('/login', AuthController.authenticateUser);
router.get('/refresh', jwtAuth, AuthController.refreshToken);

module.exports = router;