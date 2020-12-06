module.exports = function (Model, db) {
    Model.extendInclude = [
        {
            model: db.User,
            as: 'owner',
            attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
            model: db.Entry,
            as: 'entries',
            attributes: ['id', 'purpose', 'value'],
        },
    ];

    Model.prototype.writeRemotes = function (data) {
        const self = this;

        if (typeof data.name !== 'undefined') {
            self.name = data.name;
        }
        if (typeof data.ownerId !== 'undefined') {
            self.ownerId = data.ownerId;
        }
    };
};
