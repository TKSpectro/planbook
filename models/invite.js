module.exports = function (Model, db) {
    Model.extendInclude = [
        {
            model: db.User,
            as: 'sender',
            attributes: ['id', 'firstName', 'lastName'],
        },
    ];

    Model.prototype.writeUpdatedAt = function () {
        const self = this;
        self.updatedAt = new Date();
    };

    Model.prototype.writeRemotes = function (data) {
        const self = this;

        if (typeof data.validUntil !== 'undefined') {
            self.validUntil = data.validUntil;
        }
        if (typeof data.wasUsed !== 'undefined') {
            self.wasUsed = data.wasUsed;
        }
        if (typeof data.invitedEmail !== 'undefined') {
            self.invitedEmail = data.invitedEmail;
        }
        if (typeof data.link !== 'undefined') {
            self.link = data.link;
        }
        if (typeof data.householdId !== 'undefined') {
            self.householdId = data.householdId;
        }
    };
};
