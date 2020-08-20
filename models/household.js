module.exports = function (Model, db) {
    Model.prototype.writeRemotes = function (data) {
        const self = this;

        if (typeof data.name !== 'undefined') {
            self.name = data.name;
        }
    };
};
