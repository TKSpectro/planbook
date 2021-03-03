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
            ['dashboard', 'payments', 'recurringPayments'],
            async (next) => {
                if (self.param('hid')) {
                    const householdUsers = await self.db.HouseholdUser.findAll({
                        where: {
                            householdId: self.param('hid'),
                        },
                    });
                    let isInHousehold;
                    for (let user of householdUsers) {
                        if (self.req.user.id == user.id) {
                            isInHousehold = true;
                        }
                    }
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
        self.css('signin');
        self.js('signin');

        self.render({
            title: 'Login',
        });
    }

    actionSignup() {
        const self = this;

        self.css('custom');
        self.css('signup');
        self.js('signup');

        self.render({
            title: 'Register',
        });
    }

    async actionDashboard() {
        const self = this;

        // Choose between dashboardChooser and dashboardView for one household
        // based on the set hid - householdId parameter
        if (!self.param('hid')) {
            self.css('custom');

            const userHouseholds = await self.db.HouseholdUser.findAll({
                where: {
                    userId: self.req.user.id,
                },
            });

            let households = [];
            let i = 0;

            for (const userHousehold of userHouseholds) {
                households[i] = await self.db.Household.findByPk(
                    userHousehold.householdId
                );
                i++;
            }
            self.render({
                title: 'Dashboard',
                households: households,
            });
        } else {
            self.css('custom');
            self.js('Chart');
            self.js('helper');
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

            const lastPayments = await self.db.Payment.findAll({
                include: self.db.Payment.extendInclude,
                where: {
                    householdId: householdId,
                },
                limit: 10,
            });

            const categories = await self.db.Category.findAll();

            self.render({
                title: 'Dashboard ' + household.name,
                household: household,
                members: members,
                lastPayments: lastPayments,
                categories: categories,
            });
        }
    }

    async actionPayments() {
        const self = this;

        // Choose between dashboardChooser and dashboardView for one household
        // based on the set hid - householdId parameter

        self.css('custom');
        self.js('Chart');

        const householdId = self.param('hid');
        const household = await self.db.Household.findByPk(householdId);

        // Get all the payments from the household in reverse order -> newest is first
        const payments = await self.db.Payment.findAll({
            include: self.db.Payment.extendInclude,
            order: [['createdAt', 'DESC']],
            where: {
                householdId: householdId,
            },
        });

        self.render({
            title: 'Payments',
            household: household,
            payments: payments,
        });
    }

    async actionRecurringPayments() {
        const self = this;

        self.css('custom');
        self.js('Chart');
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
