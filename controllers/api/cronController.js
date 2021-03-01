const Controller = require('../mainController.js');
const ApiError = require('../../core/error.js');
const { Op } = require('sequelize');

class ApiCronController extends Controller {
    constructor(...args) {
        super(...args);
        const self = this;

        self.format = Controller.HTTP_FORMAT_JSON;

        // users have to be signed in else they a 401 Unauthorized response
        self.before(['*'], function (next) {
            if (self.param('cron_password') === process.env.CRON_PASSWORD) {
                next();
            } else {
                self.render(
                    {},
                    {
                        statusCode: 401,
                    }
                );
            }
        });
    }

    async actionBookRecurringPayments() {
        const self = this;

        let error = null;

        try {
            console.log('IT WORKED');
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render(
                {},
                {
                    statusCode: 200,
                }
            );
        }
    }
}

module.exports = ApiCronController;
