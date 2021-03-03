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
    ];

    Model.prototype.writeRemotes = function (data) {
        const self = this;

        if (typeof data.startDate !== 'undefined') {
            self.startDate = data.startDate;
        }
        if (typeof data.endDate !== 'undefined') {
            self.endDate = data.endDate;
        }
        if (typeof data.value !== 'undefined') {
            self.value = data.value;
        }
        if (typeof data.purpose !== 'undefined') {
            self.purpose = data.purpose;
        }
        if (typeof data.interval !== 'undefined') {
            self.interval = data.interval;
        }
        if (typeof data.householdId !== 'undefined') {
            self.householdId = data.householdId;
        }
        if (typeof data.categoryId !== 'undefined') {
            self.categoryId = data.categoryId;
        }
    };
};
