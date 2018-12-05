const express = require('express');
const bodyParser = require('body-parser');

const CompanyController = require('../controllers/CompanyController');

const jwtAuth = require('../middleware/jwtAuth');

const router = express.Router();

router.use(jwtAuth);
router.use(bodyParser.json());

// company routes
router.get('/', CompanyController.getCompany);
router.post('/', CompanyController.createCompany);

// share class routes
router.post('/shareClass', CompanyController.addShareClass);
router.get('/shareClass/:classSlug', CompanyController.getShareClass);
router.get('/shareClass', CompanyController.getAllShareClasses);
router.put('/shareClass/:classSlug', CompanyController.updateShareClass);

// shares routes
router.post('/shares/:type', CompanyController.addInvestment);
router.get('/shares/:type', CompanyController.getAllInvestments);
router.get('/shares/:type/:id', CompanyController.getInvestment);

// pending shares route (issued cannot be updated or deleted)
router.put('/shares/pending/:id', CompanyController.updateInvestment);
router.delete('/shares/pending/:id', CompanyController.deleteInvestment);

module.exports = router;