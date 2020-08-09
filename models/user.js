const Passport = require('../core/passport.js');
module.exports = function (Model, db) {
    Model.extendInclude = [
        {
            model: db.Household,
            as: 'household',
            attributes: ['id', 'name'],
        },
    ];

    Model.prototype.fullname = function () {
        return this.firstName + ' ' + this.lastName;
    };

    Model.prototype.shortName = function () {
        return this.firstName.charAt(0) + this.lastName.charAt(0);
    };

    Model.prototype.writeRemotes = function (data) {
        const self = this;

        if (typeof data.firstName !== 'undefined') {
            self.firstName = data.firstName;
        }

        if (typeof data.lastName !== 'undefined') {
            self.lastName = data.lastName;
        }

        if (typeof data.email === 'string') {
            self.email = data.email.toLowerCase();
        } else if (typeof data.email !== 'undefined') {
            self.email = data.email;
        }

        if (typeof data.password !== 'undefined') {
            self.passwordHash = Passport.hashPassword(data.password);
        }

        if (typeof data.permission !== 'undefined') {
            self.permission = data.permission;
        }

        if (typeof data.taskCreated !== 'undefined') {
            self.taskCreated = data.taskCreated;
        }

        if (typeof data.tasksAssignedTo !== 'undefined') {
            self.tasksAssignedTo = data.tasksAssignedTo;
        }
    };

    Model.prototype.findByID = async function () {
        let user = await self.db.User.findOne({
            where: {
                email: email,
            },
        });

        self.db.Message.create({
            text: data.message,
            fromId: socket.user.id,
            toId: user.id,
        });
        self.io.emit('message', {
            message: data.message,
            from: {
                displayName: socket.user.fullname(),
                id: socket.user.id,
            },
            to: user.id,
            time: new Date(),
        });
    };
};
