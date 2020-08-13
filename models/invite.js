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

        if (typeof data.email !== 'undefined') {
            self.email = data.email;
        }
        if (typeof data.householdId !== 'undefined') {
            self.householdId = data.householdId;
        }
    };
};
