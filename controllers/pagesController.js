const Controller = require('./mainController.js');
class PagesController extends Controller {
    constructor(...args) {
        super(...args);
        const self = this;

        self.css('custom');

        self.before(
            ['*', '-imprint', '-signin', '-signup', '-index'],
            (next) => {
                if (self.req.authorized === true) {
                    next();
                } else {
                    self.redirect(self.urlFor('pages', 'signin'));
                }
            }
        );

        self.before(
            ['dashboard', 'payments', 'recurringPayments', 'members'],
            async (next) => {
                if (self.param('hid')) {
                    const householdUsers = await self.db.HouseholdUser.findAll({
                        where: {
                            householdId: self.param('hid'),
                        },
                    });

                    let isInHousehold = false;
                    householdUsers.forEach((householdUser) => {
                        if (self.req.user.id == householdUser.userId) {
                            isInHousehold = true;
                        }
                    });
                    if (isInHousehold) {
                        next();
                    } else {
                        self.redirect(self.urlFor('pages', 'dashboard'));
                    }
                } else {
                    next();
                }
            }
        );

        self.before(['signin', 'signup', 'index'], (next) => {
            if (self.req.authorized === true) {
                self.redirect(self.urlFor('pages', 'dashboard'));
            } else {
                next();
            }
        });
    }

    async actionIndex() {
        const self = this;

        self.css('custom');
        self.js('index');

        const users = await self.db.User.findAll();

        self.render({
            title: 'Home',
            users: users,
        });
    }

    actionImprint() {
        const self = this;

        self.css('custom');

        self.render({
            title: 'Imprint',
        });
    }

    actionSignin() {
        const self = this;

        self.css('custom');
        self.js('signin');
        self.js('helper');

        self.render({
            title: 'Login',
        });
    }

    actionSignup() {
        const self = this;

        self.css('custom');
        self.js('signup');
        self.js('helper');

        self.render({
            title: 'Register',
        });
    }

    async actionDashboard() {
        const self = this;
        self.js('helper');

        // Choose between dashboardChooser and dashboardView for one household
        // based on the set hid - householdId parameter
        if (!self.param('hid')) {
            self.css('custom');
            self.js('dashboardList');

            self.render({
                title: 'Dashboard',
                isHouseholdChooser: true,
            });
        } else {
            self.css('custom');
            self.js('Chart');
            self.js('dashboard');

            const householdId = self.param('hid');
            const household = await self.db.Household.findByPk(householdId);
            const householdUsers = await self.db.HouseholdUser.findAll({
                where: {
                    householdId: householdId,
                },
            });
            const members = [];
            for (let user of householdUsers) {
                members.push(await self.db.User.findByPk(user.id));
            }

            const categories = await self.db.Category.findAll();

            self.render({
                title: 'Dashboard ' + household.name,
                household: household,
                categories: categories,
                isHouseholdChooser: false,
            });
        }
    }

    async actionPayments() {
        const self = this;

        // Choose between dashboardChooser and dashboardView for one household
        // based on the set hid - householdId parameter

        self.css('custom');
        self.js('Chart');
        self.js('payment');
        self.js('helper');
        self.js('savePayment');

        const householdId = self.param('hid');
        const household = await self.db.Household.findByPk(householdId);

        const categories = await self.db.Category.findAll();

        self.render({
            title: 'Payments',
            household: household,
            categories: categories,
        });
    }

    async actionRecurringPayments() {
        const self = this;

        self.css('custom');
        self.js('Chart');
        self.js('helper');
        self.js('recurringPayment');

        const householdId = self.param('hid');
        const household = await self.db.Household.findByPk(householdId);

        // Get all the recurringPayments from the household in reverse order -> newest is first
        const recurringPayments = await self.db.RecurringPayment.findAll({
            include: self.db.RecurringPayment.extendInclude,
            order: [['createdAt', 'DESC']],
            where: {
                householdId: householdId,
            },
        });

        const categories = await self.db.Category.findAll();

        self.render({
            title: 'Payments',
            household: household,
            recurringPayments: recurringPayments,
            categories: categories,
        });
    }

    async actionMembers() {
        const self = this;

        if (!self.param('hid')) {
            self.redirect(self.urlFor('pages', 'dashboard'));
            return;
        }

        const householdId = self.param('hid');
        const household = await self.db.Household.findByPk(householdId);

        if (self.req.user.id != household.ownerId) {
            self.redirect(self.urlFor('pages', 'dashboard'));
            return;
        }

        self.css('custom');
        self.js('Chart');
        self.js('helper');
        self.js('member');

        const invites = await self.db.Invite.findAll({
            where: {
                householdId: self.param('hid'),
            },
        });

        const householdUsers = await self.db.HouseholdUser.findAll({
            include: self.db.HouseholdUser.extendInclude,
            where: {
                householdId: self.param('hid'),
            },
        });

        const members = [];
        householdUsers.forEach((data) => {
            members.push(data.user);
        });

        self.render({
            title: 'Members',
            members: members,
            invites: invites,
        });
    }

    async actionTodo() {
        const self = this;

        self.css('custom');
        self.js('todo');

        const todos = await self.db.Todo.findAll({
            where: {
                householdId: self.req.user.id,
            },
            include: self.db.Todo.extendInclude,
        });

        self.render({
            title: 'Todo',
            todos: todos,
        });
    }
}

module.exports = PagesController;
