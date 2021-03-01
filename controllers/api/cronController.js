const Controller = require('../mainController.js');
const ApiError = require('../../core/error.js');
const { Op } = require('sequelize');
const { performance } = require('perf_hooks');

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
        let writtenPayments = [];
        try {
            console.log('Start booking recurringPayments');
            let timer = performance.now();

            // Get all recurringPayments which happened today
            let recurringPayments = await self.db.RecurringPayment.findAll();
            let payment;
            for (payment of recurringPayments) {
                // EndDate has to be not defined OR be bigger then the current date
                // Then check if the payment should happen today
                let today = new Date();
                if (
                    (typeof payment.endDate !== 'undefined' ||
                        payment.endDate > today) &&
                    (payment.interval === 'daily' ||
                        (payment.interval === 'monthly' &&
                            payment.startDate.getDate() === today.getDate()) ||
                        (payment.interval === 'quarterly' &&
                            payment.startDate.getDate() === today.getDate() &&
                            payment.startDate.getMonth() % 4 ===
                                new Date.getMonth() % 4) ||
                        (payment.interval === 'yearly' &&
                            payment.startDate.getDate() === today.getDate() &&
                            payment.startDate.getMonth() === today.getMonth()))
                ) {
                    // Write the recurringPayment into the payment table
                    await self.db.sequelize.transaction(async (t) => {
                        let newPayment = self.db.Payment.build();
                        newPayment.writeRemotes(payment);

                        newPayment['recurringPaymentId'] = payment.id;

                        await newPayment.save({
                            transaction: t,
                            lock: true,
                        });
                        writtenPayments.push(newPayment);
                        return newPayment;
                    });
                }
            }

            let timerEnd = performance.now();
            console.log(
                'Finished booking recurringPayments\nTook:' +
                    (timerEnd - timer) +
                    ' milliseconds'
            );
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render(
                { writtenPayments: writtenPayments },
                {
                    statusCode: 200,
                }
            );
        }
    }
}

module.exports = ApiCronController;
