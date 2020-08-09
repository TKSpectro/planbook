const Passport = require('../core/passport.js');
module.exports = function (Model, db) {
    Model.extendInclude = [
        {
            model: db.Household,
            as: 'household',
            attributes: ['id', 'name'],
        },
    ];

    Model.prototype.writeRemotes = function (data) {
        const self = this;

        if (typeof data.income !== 'undefined') {
            self.income = data.income;
        }
        if (typeof data.timeStamp !== 'undefined') {
            self.timeStamp = data.timeStamp;
        }
        if (typeof data.value !== 'undefined') {
            self.value = data.value;
        }
        if (typeof data.purpose !== 'undefined') {
            self.purpose = data.purpose;
        }
        if (typeof data.interval !== 'undefined') {
            self.interval = data.interval;
        }
    };
};
