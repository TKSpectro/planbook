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

        if (typeof data.task !== 'undefined') {
            self.task = data.task;
        }
        if (typeof data.value !== 'undefined') {
            self.value = data.value;
        }
        if (typeof data.done !== 'undefined') {
            self.done = data.done;
        }
    };
};
