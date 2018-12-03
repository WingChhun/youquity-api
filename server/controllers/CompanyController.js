const Company = require('../models/Company');

const checkForRequiredFields = require('./helpers/checkForRequiredFields');

class CompanyController {
    static createCompany(req, res) {
        Company
            .countDocuments({}, function(err, count) {
                if(count > 0) {
                    res.status(403).json({message: 'Only one company is allowed.  You cannot create another company.'}).end();
                } else {
                    const requiredFields = ['name'];
                    const validate = checkForRequiredFields(requiredFields, req.body);
                    if (validate) {
                        res.status(400).send(validate);
                    }

                    Company
                        .create({ name: req.body.name })
                        .then((company) => {
                            res.status(201).json(company.serialize());
                        });
                }
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Internal server error.' });
            });
    }

    static getCompany(req, res) {
        Company
            .findOne()
            .then((company) => {
                res.status(200).json(company.serialize());
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({message: 'Internal server error.'});
            });
    }

    static addShareClass(req, res) {
        const requiredFields = ['classSlug', 'className', 'currentlyOffered', 'authedShares', 'reservedShares', 'currentPrice'];
        const validate = checkForRequiredFields(requiredFields, req.body);
        if (validate) {
            res.status(400).send(validate);
        }
        Company
            .findOne()
            .then((company) => {
                const existingClass = company.getShareClassBySlug(req.body.classSlug);
                if (existingClass) {
                    res.status(400).json({message: `Share class with slug ${req.body.classSlug} already exists.`});
                } else {
                    const shareClass = {
                        classSlug: req.body.classSlug,
                        className: req.body.className,
                        currentlyOffered: req.body.currentlyOffered,
                        authedShares: req.body.authedShares,
                        reservedShares: req.body.reservedShares,
                        currentPrice: req.body.currentPrice
                    }
                    company.shareClasses.push(shareClass);
                    company.save();
                    res.status(201).json(company.serialize());
                }
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({message: 'Internal server error.'});
            });
    }

    static getShareClass(req, res) {
        const requiredFields = ['classSlug'];
        const validate = checkForRequiredFields(requiredFields, req.params);
        if (validate) {
            res.status(400).send(validate);
        }

        Company
            .findOne()
            .then((company) => {
                const shareClass = company.getShareClassBySlug(req.params.classSlug);
                if(!shareClass) {
                    res.status(404).json({message: 'Not found.'});
                } else {
                    res.status(200).json(shareClass);
                }
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({message: 'Internal server error.'});
            });
    }
}

module.exports = CompanyController;