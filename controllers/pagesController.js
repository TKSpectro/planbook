const Controller = require('./mainController.js');
let isOwner = false;
class PagesController extends Controller {
    constructor(...args) {
        super(...args);
        const self = this;

        self.css('custom');

        self.before(['*', '-imprint', '-login', '-register'], (next) => {
            if (self.req.authorized === true) {
                next();
            } else {
                self.redirect(self.urlFor('pages', 'login'));
            }
        });

        self.before(
            ['dashboard', 'payments', 'recurringPayments', 'members', 'moneypools'],
            async (next) => {
                if (self.param('hid')) {
                    const householdUsers = await self.db.HouseholdUser.findAll({
                        include: self.db.HouseholdUser.extendIncludeHousehold,
                        where: {
                            householdId: self.param('hid'),
                        },
                    });

                    let isInHousehold = false;
                    isOwner = false;
                    householdUsers.forEach((householdUser) => {
                        if (self.req.user.id == householdUser.userId) {
                            isInHousehold = true;
                            if (householdUser.household.ownerId === householdUser.userId) {
                                isOwner = true;
                            }
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

        self.before(['login', 'register', 'index'], (next) => {
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

        self.render({
            title: 'Home',
            urlHouseholdId: self.param('hid'),
            isOwner: isOwner,
        });
    }

    actionImprint() {
        const self = this;

        self.css('custom');

        self.render({
            title: 'Imprint',
            urlHouseholdId: self.param('hid'),
            isOwner: isOwner,
        });
    }

    actionLogin() {
        const self = this;

        self.css('custom');
        self.js('login');
        self.js('helper');

        self.render({
            title: 'Login',
            urlHouseholdId: self.param('hid'),
            isOwner: isOwner,
        });
    }

    actionRegister() {
        const self = this;

        self.css('custom');
        self.js('register');
        self.js('helper');

        self.render({
            title: 'Register',
            urlHouseholdId: self.param('hid'),
            isOwner: isOwner,
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
                urlHouseholdId: self.param('hid'),
                isOwner: isOwner,
                isHouseholdChooser: true,
            });
        } else {
            self.css('custom');
            self.js('Chart');
            self.js('dashboard');
            self.js('savePayment');

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
                urlHouseholdId: self.param('hid'),
                isOwner: isOwner,
                household: household,
                categories: categories,
                isHouseholdChooser: false,
            });
        }
    }

    async actionPayments() {
        const self = this;

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
            urlHouseholdId: self.param('hid'),
            isOwner: isOwner,
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

        const categories = await self.db.Category.findAll();

        self.render({
            title: 'Payments',
            urlHouseholdId: self.param('hid'),
            isOwner: isOwner,
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

        self.render({
            title: 'Members',
            urlHouseholdId: self.param('hid'),
            isOwner: isOwner,
            household: household,
        });
    }

    async actionMoneypools() {
        const self = this;

        self.css('custom');
        self.js('helper');
        self.js('saveMoneypool');

        let isMoneypoolChooser = false;
        if (self.param('id')) {
            self.js('Chart');
            self.js('chartjs-plugin-datalabels');
            self.js('moneypool');
        } else {
            self.js('moneypoolList');
            isMoneypoolChooser = true;
        }

        self.render({
            title: 'Moneypools',
            urlHouseholdId: self.param('hid'),
            isOwner: isOwner,
            isMoneypoolChooser: isMoneypoolChooser,
        });
    }
}

module.exports = PagesController;
