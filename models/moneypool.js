module.exports = function (Model, db) {
    Model.extendInclude = [
        {
            model: db.Household,
            as: 'household',
        },
    ];

    Model.prototype.writeRemotes = function (data) {
        const self = this;

        if (typeof data.name !== 'undefined') {
            self.name = data.name;
        }
        if (typeof data.description !== 'undefined') {
            self.description = data.description;
        }
        if (typeof data.currentNeededMoney !== 'undefined') {
            self.currentNeededMoney = data.currentNeededMoney;
        }
        if (typeof data.totalNeededMoney !== 'undefined') {
            self.totalNeededMoney = data.totalNeededMoney;
        }
        if (typeof data.householdId !== 'undefined') {
            self.householdId = data.householdId;
        }
    };
};
