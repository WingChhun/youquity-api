const express = require('express');
const bodyParser = require('body-parser');

const CompanyController = require('../controllers/CompanyController');

const router = express.Router();

router.use(bodyParser.json());

router.get('/', CompanyController.getCompany);
router.post('/', CompanyController.createCompany);

router.post('/shareClass', CompanyController.addShareClass);

module.exports = router;