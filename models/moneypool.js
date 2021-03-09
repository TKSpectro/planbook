module.exports = function (Model, db) {
    Model.extendInclude = [
        {
            model: db.Household,
            as: 'household',
        },
        {
            model: db.Payment,
            as: 'payments',
            include: [
                {
                    model: db.User,
                    as: 'user',
                },
            ],
        },
    ];
    Model.extendIncludeHousehold = [
        {
            model: db.Household,
            as: 'household',
        },
    ];
    Model.extendIncludePayments = [
        {
            model: db.Payment,
            as: 'payments',
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
        if (typeof data.totalNeededMoney !== 'undefined') {
            self.totalNeededMoney = data.totalNeededMoney;
        }
        if (typeof data.householdId !== 'undefined') {
            self.householdId = data.householdId;
        }
    };
};
