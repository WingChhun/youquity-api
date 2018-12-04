const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const issuedSharesSchema = require('./IssuedShares');
const pendingSharesSchema = require('./PendingShares');
const shareClassSchema = require('./ShareClass');

const companySchema = mongoose.Schema({
    name: {type: String, required: true, trim: true},
    shareClasses: [shareClassSchema],
    investmentData: {
        issued: [issuedSharesSchema],
        pending: [pendingSharesSchema]
    }
});

/////// SHARE CLASS METHODS ///////
companySchema.methods.getShareClassBySlug = function(slug, serialize = true) {
    for(i = 0; i < this.shareClasses.length; i++) {
        if(this.shareClasses[i].classSlug === slug) {
            if(serialize) {
                return this.shareClasses[i].serialize();
            } else {
                return this.shareClasses[i];
            }
            
        }
    }
    return false;
}

companySchema.methods.updateShareClass = function (updateData) {
    const shareClass = this.getShareClassBySlug(updateData.classSlug, false);
    shareClass.set(updateData);
    this.save();
    return this.serialize();
}

/////// INVESTMENT METHODS //////

companySchema.methods.getInvestmentArrayPositionById = function (type, id) {
    const array = this.investmentData[type];

    for (i = 0; i < array.length; i++) {
        if (array[i].id === id) {
            return i;
        }
    }
    return false;
}

companySchema.methods.getInvestmentById = function(type, id) {

    const position = this.getInvestmentArrayPositionById(type, id);
    if(position !== false) { // need strict false due to poss. zero index
        return this.investmentData[type][position];
    }
    return false;
}

companySchema.methods.deleteInvestmentById = async function(type, id) {
    this.investmentData[type].pull({_id: id});
    const updatedThis = await this.save();
    if(updatedThis) {
        return true;
    } else {
        return false;
    }
}

companySchema.methods.updateInvestment = function (updateData, type) {
    const investment = this.getInvestmentById(type, updateData.id);
    investment.set(updateData);
    this.save();
    return investment.serialize();
}

companySchema.methods.addInvestment = async function (newData, type) {
    const newInvestment = this.investmentData[type].create(newData);
    this.investmentData[type].push(newInvestment);
    const updatedThis = await this.save();
    if (updatedThis) return newInvestment.serialize();
}

/////// COMPANY SUMMARY METHODS ///////
companySchema.methods.countIssuedShares = function() {
    const issued = {};
    this.investmentData.issued.forEach((cert) => {
        if(issued[cert.shareClassSlug]) {
            issued[cert.shareClassSlug] += cert.numShares;
        } else {
            issued[cert.shareClassSlug] = cert.numShares;
        }
    });
    return issued;
}

companySchema.methods.checkForPending = function() {
    const classList = {};
    const classCount = this.shareClasses.length;
    let pendingFoundCount = 0;
    const pendingList = this.investmentData.pending;

    for(i = 0; i < pendingList.length; i++) {
        if(!classList[pendingList[i].classSlug]) {
            classList[pendingList[i].classSlug] = true;
            pendingFoundCount += 1;
            if(classCount === pendingFoundCount) {
                break;
            }
        }
    }
    return classList;
}

companySchema.methods.assembleSummaryData = function() {
    const issuedShareList = this.countIssuedShares();
    let issuedShares = 0;
    let authorizedShares = 0;
    let reservedShares = 0;

    this.shareClasses.forEach((shareClass) => {
        authorizedShares += shareClass.authedShares;
        reservedShares += shareClass.reservedShares;
        issuedShares += issuedShareList[shareClass.classSlug]
    });

    return {
        summaryData: [
            {
                label: 'Authorized Shares',
                data: authorizedShares
            },
            {
                label: 'Issued Shares',
                data: issuedShares
            },
            {
                label: 'Reserved Shares',
                data: reservedShares
            }
        ],
        issuedShareList: issuedShareList
    };
}

companySchema.methods.summarizeShareClasses = function(issuedShareList, pendingList) {
    const shareClasses = this.shareClasses;
    const result = [];
    shareClasses.forEach((shareClass) => {
        result.push(
            {
                classSlug: shareClass.classSlug,
                className: shareClass.className,
                currentlyOffered: shareClass.currentlyOffered,
                classData: [
                    {
                        dataSlug: 'authedShares',
                        dataName: 'Authorized Shares',
                        data: shareClass.authedShares,
                        editable: true
                    },
                    {
                        dataSlug: 'issuedShares',
                        dataName: 'Issued Shares',
                        data: (issuedShareList[shareClass.classSlug] ? issuedShareList[shareClass.classSlug] : 0),
                        editable: false
                    },
                    {
                        dataSlug: 'reservedShares',
                        dataName: 'Reserved Shares',
                        data: shareClass.reservedShares,
                        editable: true
                    },
                    {
                        dataSlug: 'currentlyOffered',
                        dataName: 'Currently Offered',
                        data: shareClass.currentlyOffered,
                        editable: true
                    },
                    {
                        dataSlug: 'currentPrice',
                        dataName: 'Current Price per Share',
                        data: shareClass.currentPrice,
                        editable: true
                    },
                    {
                        dataSlug: 'requestsPending',
                        dataName: 'Requests Pending',
                        data: (pendingList[shareClass.classSlug] ? true : false),
                        editable: false
                    }
                ]
            }
        )
    });

    return result;
}

/////// STANDARD COMPANY METHODS ///////

companySchema.methods.serialize = function() {
    const assembledSummary = this.assembleSummaryData();
    const pendingList = this.checkForPending();

    return {
        companyData: {
            name: this.name,
            summaryData: assembledSummary.summaryData,
            shareClasses: this.summarizeShareClasses(assembledSummary.issuedShareList, pendingList)
        },
        investmentData: {
            issued: this.investmentData.issued.map(issued => issued.serialize()),
            pending: this.investmentData.pending.map(pending => pending.serialize())
        },

    }

}

const Company = mongoose.model('Company', companySchema);

module.exports = Company;