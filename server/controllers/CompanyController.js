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

    static updateShareClass(req, res) {
        const requiredFields = ['classSlug'];
        const validate = checkForRequiredFields(requiredFields, req.body);
        if (validate) {
            res.status(400).send(validate);
        }

        if(req.body.classSlug !== req.params.classSlug) {
            res.status(400).json({message: 'classSlug in request body must match classSlug in url parameter'}).send();
        }

        const updatable = ['currentlyOffered', 'authedShares', 'reservedShares', 'currentPrice'];
        Company
            .findOne()
            .then((company) => {
                const updateData = {classSlug:req.body.classSlug};
                updatable.forEach((element) => {
                    if(req.body[element]) {
                        updateData[element] = req.body[element]
                    }
                });
                return company.updateShareClass(updateData);
            })
            .then((company) => {
                res.status(200).json(company);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({message: 'Internal server error.'});
            })
    }

    static addInvestment(req, res) {
        const pendingFields = ['requestDate', 'subsAgmt', 'pymtRecd'];

        const issuedFields = ['certificateNum', 'pricePerShare', 'purchaseDate', 'issueDate'];

        const sharedFields = ['certificateTitle', 'numShares', 'shareClassSlug'];

        let requiredFields;
        if(req.params.type === 'pending') {
            requiredFields = [...pendingFields, ...sharedFields];
        } else {
            requiredFields = [...issuedFields, ...sharedFields];
        }
        const validate = checkForRequiredFields(requiredFields, req.body);
        if (validate) {
            res.status(400).send(validate);
            return;
        }

        Company
            .findOne()
            .then((company) => {
                const existingClass = company.getShareClassBySlug(req.body.shareClassSlug);
                if (!existingClass) {
                    res.status(404).json({ message: `Share class with slug ${req.body.shareClassSlug} does not exist.` });
                } else {
                    const newData = {
                        certificateTitle: req.body.certificateTitle,
                        numShares: req.body.numShares,
                        shareClassSlug: req.body.shareClassSlug
                    };

                    if(req.params.type === 'pending') {
                        newData.requestDate = req.body.requestDate;
                        newData.workflow = {
                            subsAgmt: req.body.subsAgmt,
                            pymtRecd: req.body.pymtRecd
                        };
                    } else {
                        newData.purchaseDate = req.body.purchaseDate;
                        newData.pricePerShare = req.body.pricePerShare;
                        newData.issueDate = req.body.issueDate;
                        newData.certificateNum = req.body.certificateNum;
                    }

                    return company.addInvestment(newData, req.params.type);
                }
            })
            .then((createdInvestment) => {
                res.status(201).json(createdInvestment);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Internal server error.' });
            });
    }

    static getInvestment(req, res) {
        Company
            .findOne()
            .then((company) => {
                const investment = company.getInvestmentById(req.params.type, req.params.id);
                res.status(200).json(investment.serialize());
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({message: 'Internal server error.'});
            });
    }

    static getAllInvestments(req, res) {
        Company
            .findOne()
            .then((company) => {
                const serialized = company.serialize();
                res.status(200).json(serialized.investmentData[req.params.type]);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({message: 'Internal server error.'});
            });
    }

    static updateInvestment(req, res) {
        const requiredFields = ['id'];
        const validate = checkForRequiredFields(requiredFields, req.body);
        if (validate) {
            res.status(400).send(validate);
        }

        if (req.body.id !== req.params.id) {
            res.status(400).json({ message: 'id in request body must match id in url parameter' }).send();
        }

        const updatable = ['certificateTitle', 'numShares', 'shareClassSlug', 'workflow'];
        Company
            .findOne()
            .then((company) => {
                const updateData = { id: req.body.id };
                updatable.forEach((element) => {
                    if (req.body[element]) {
                        updateData[element] = req.body[element]
                    }
                });

                return company.updateInvestment(updateData, 'pending');
            })
            .then((pendingInvestment) => {
                res.status(200).json(pendingInvestment);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Internal server error.' });
            })
    }

    static deleteInvestment(req, res) {
        Company
            .findOne()
            .then((company) => {
                if(company.deleteInvestmentById(req.params.id, req.params.id)) {
                    res.status(200).json({message: `Investment ${req.params.id} deleted.`});
                } else {
                    res.status(304).send();
                }
            })
    }
}

module.exports = CompanyController;