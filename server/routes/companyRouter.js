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
router.get('/shareClass/:classSlug', CompanyController.getShareClass);
router.put('/shareClass/:classSlug', CompanyController.updateShareClass);

// pending shares routes
router.post('/shares/pending', CompanyController.addPendingInvestment);
router.get('/shares/pending', CompanyController.getAllPendingInvestments);
router.get('/shares/pending/:id', CompanyController.getPendingInvestment);
router.put('/shares/pending/:id', CompanyController.updatePendingInvestment);

module.exports = router;