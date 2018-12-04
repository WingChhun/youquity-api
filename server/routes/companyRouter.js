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

// shares routes
router.post('/shares/:type', CompanyController.addInvestment);
router.get('/shares/:type', CompanyController.getAllInvestments);
router.get('/shares/:type/:id', CompanyController.getInvestment);
router.delete('/shares/:type/:id', CompanyController.deleteInvestment);

// update pending shares route (issued cannot be updated)
router.put('/shares/pending/:id', CompanyController.updateInvestment);

module.exports = router;