const Passport = require('../core/passport.js');
module.exports = function (Model, db) {
    Model.extendInclude = [
        {
            model: db.Household,
            as: 'household',
            attributes: ['id', 'name'],
        },
    ];

    Model.prototype.fullname = function () {
        return this.firstName + ' ' + this.lastName;
    };

    Model.prototype.writeRemotes = function (data) {
        const self = this;

        if (typeof data.firstName !== 'undefined') {
            self.firstName = data.firstName;
        }

        if (typeof data.lastName !== 'undefined') {
            self.lastName = data.lastName;
        }

        if (typeof data.email === 'string') {
            self.email = data.email.toLowerCase();
        } else if (typeof data.email !== 'undefined') {
            self.email = data.email;
        }

        if (typeof data.password !== 'undefined') {
            self.passwordHash = Passport.hashPassword(data.password);
        }

        if (typeof data.householdId !== 'undefined') {
            self.householdId = data.householdId;
        }
    };
};
