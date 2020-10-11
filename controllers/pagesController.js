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

    actionDashboard() {
        const self = this;

        self.css('custom');
        self.js('dashboard');

        self.render({
            title: 'Dashboard',
        });
    }
}

module.exports = PagesController;
