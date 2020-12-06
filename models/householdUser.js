module.exports = function (Model, db) {
    Model.extendIncludeHousehold = [
        {
            model: db.Household,
            as: 'household',
            attributes: ['id', 'name', 'ownerId'],
        },
    ];
    Model.extendInclude = [
        {
            model: db.User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
            model: db.Household,
            as: 'household',
            attributes: ['id', 'name', 'ownerId'],
        },
    ];

    Model.prototype.writeRemotes = function (data) {
        const self = this;

        if (typeof data.timeJoined !== 'undefined') {
            self.timeJoined = data.timeJoined;
        } else {
            self.timeJoined = new Date();
        }
        if (typeof data.householdId !== 'undefined') {
            self.householdId = data.householdId;
        }
        if (typeof data.userId !== 'undefined') {
            self.userId = data.userId;
        }
    };
};
