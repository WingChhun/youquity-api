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

companySchema.methods.getShareClassBySlug = function(slug) {
    for(i = 0; i < this.shareClasses.length; i++) {
        if(this.shareClasses[i].classSlug === slug) {
            return this.shareClasses[i].serialize();
        }
    }
    return false;
}

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
    const pendingFoundCount = 0;
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