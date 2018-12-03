const express = require('express');
const bodyParser = require('body-parser');

const CompanyController = require('../controllers/CompanyController');

const router = express.Router();

router.use(bodyParser.json());

// company routes
router.get('/', CompanyController.getCompany);
router.post('/', CompanyController.createCompany);

// share class routes
router.post('/shareClass', CompanyController.addShareClass);
router.post('/shareClass/:classSlug', CompanyController.getShareClass);

module.exports = router;