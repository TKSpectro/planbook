const Passport = require('../core/passport.js');
module.exports = function (Model, db) {
    Model.extendInclude = [
        {
            model: db.Entry,
            as: 'entries',
            attributes: [
                'id',
                'name',
                'income',
                'timeStamp',
                'value',
                'purpose',
                'interval',
                'householdId',
                'categoryId',
            ],
        },
    ];

    Model.prototype.writeRemotes = function (data) {
        const self = this;

        if (typeof data.name !== 'undefined') {
            self.name = data.name;
        }
    };
};
