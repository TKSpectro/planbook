const Controller = require('../mainController.js');
const ApiError = require('../../core/error.js');
const { Op } = require('sequelize');
const { performance } = require('perf_hooks');
const crypto = require('crypto');
class ApiCronController extends Controller {
    constructor(...args) {
        super(...args);
        const self = this;

        self.format = Controller.HTTP_FORMAT_JSON;

        // users have to be signed in else they a 401 Unauthorized response
        self.before(['bookRecurringPayments'], function (next) {
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

    async actionDeploy() {
        const self = this;
        let error;

        // calculate the signature
        const expectedSignature =
            'sha1=' +
            crypto
                .createHmac('sha1', 'githubDeploy')
                .update(JSON.stringify(self.req.body))
                .digest('hex');

        // compare the signature against the one in the request
        const signature = self.req.headers['x-hub-signature'];
        if (signature !== expectedSignature) {
            throw new Error('Invalid signature.');
        }

        const exec = require('child_process').exec;
        const shellScript = exec('sh /root/updatePlanbook.sh');

        shellScript.stdout.on('data', (data) => {
            console.log(data);
        });
        shellScript.stderr.on('data', (data) => {
            console.error(data);
        });

        try {
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
                    (typeof payment.endDate !== 'undefined' || payment.endDate > today) &&
                    (payment.interval === 'daily' ||
                        (payment.interval === 'weekly' &&
                            payment.startDate.getDay() === today.getDay()) ||
                        (payment.interval === 'monthly' &&
                            payment.startDate.getDate() === today.getDate()) ||
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
                'Finished booking recurringPayments\nTook:' + (timerEnd - timer) + ' milliseconds'
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
