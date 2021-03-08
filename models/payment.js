module.exports = function (Model, db) {
    Model.extendInclude = [
        {
            model: db.Household,
            as: 'household',
            attributes: ['id', 'name'],
        },
        {
            model: db.Category,
            as: 'category',
            attributes: ['id', 'name'],
        },
        {
            model: db.RecurringPayment,
            as: 'recurringPayment',
            attributes: ['id', 'purpose', 'value'],
        },
        {
            model: db.Moneypool,
            as: 'moneypool',
        },
    ];

    Model.prototype.writeRemotes = function (data) {
        const self = this;

        if (typeof data.value !== 'undefined') {
            self.value = data.value;
        }
        if (typeof data.purpose !== 'undefined') {
            self.purpose = data.purpose;
        }
        if (typeof data.householdId !== 'undefined') {
            self.householdId = data.householdId;
        }
        if (typeof data.categoryId !== 'undefined') {
            self.categoryId = data.categoryId;
        }
        if (typeof data.recurringPaymentId !== 'undefined') {
            self.recurringPaymentId = data.recurringPaymentId;
        }
        if (typeof data.moneypoolId !== 'undefined') {
            self.moneypoolId = data.moneypoolId;
        }
    };
};
