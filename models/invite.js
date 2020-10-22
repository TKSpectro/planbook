module.exports = function (Model, db) {
    Model.extendInclude = [
        {
            model: db.User,
            as: 'sender',
            attributes: ['id', 'firstName', 'lastName', 'householdId'],
        },
    ];

    Model.prototype.writeUpdatedAt = function () {
        const self = this;
        self.updatedAt = new Date();
    };

    Model.prototype.writeRemotes = function (data) {
        const self = this;

        if (typeof data.link !== 'undefined') {
            self.link = data.link;
        }
        if (typeof data.senderId !== 'undefined') {
            self.senderId = data.senderId;
        }
    };
};
