/**
 * @author Tom Käppler <tomkaeppler@web.de>
 * @version 1.0.0
 */

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

        self.before(['signin', 'signup'], (next) => {
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
    }

    async actionDashboardOne() {
        const self = this;

        self.css('custom');
        self.js('Chart');
        self.js('helper');
        self.js('dashboard');

        let entryId = self.param('id');
        const household = await self.db.Household.findByPk(entryId);
        const householdUsers = await self.db.HouseholdUser.findAll({
            where: { householdId: entryId },
        });
        const members = [];
        for (let user of householdUsers) {
            members.push(await self.db.User.findByPk(user.id));
        }

        const lastPayments = await self.db.Entry.findAll({
            where: {
                householdId: entryId,
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
