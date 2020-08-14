/**
 * @author Tom Käppler <tomkaeppler@web.de>
 * @version 1.0.0
 */

const Controller = require('./mainController.js');
class PagesController extends Controller {
    constructor(...args) {
        super(...args);
        const self = this;

        self.css('layout');

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

        self.css('tailwind');
        self.js('index');

        const users = await self.db.User.findAll();

        self.render({
            title: 'Home',
            users: users,
        });
    }

    actionImprint() {
        const self = this;

        self.css('tailwind');

        self.render({
            title: 'Imprint',
        });
    }

    actionSignin() {
        const self = this;

        self.js('signin');
        self.css('tailwind');

        self.render({
            title: 'Login',
        });
    }

    actionSignup() {
        const self = this;

        self.js('signup');
        self.css('tailwind');

        self.render({
            title: 'Register',
        });
    }

    actionDashboard() {
        const self = this;

        self.js('dashboard');
        self.css('tailwind');

        self.render({
            title: 'Dashboard',
        });
    }
}

module.exports = PagesController;
