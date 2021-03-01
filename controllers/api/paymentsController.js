const Controller = require('../mainController.js');
const ApiError = require('../../core/error.js');
const { Op } = require('sequelize');

class ApiPaymentsController extends Controller {
    constructor(...args) {
        super(...args);
        const self = this;

        self.format = Controller.HTTP_FORMAT_JSON;

        // users have to be signed in else they a 401 Unauthorized response
        self.before(['*'], function (next) {
            if (self.req.authorized === true) {
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

    // you get all payments for the selected household
    async actionGetAll() {
        const self = this;

        // define the where clause for the sql query
        let where = {
            householdId: self.param('householdId'),
        };

        let payments = [];
        let error = null;

        try {
            payments = await self.db.Payment.findAll({
                include: self.db.Payment.extendInclude,
                where: where,
            });
            if (!payments.toString()) {
                // throw a standard 404 nothing found
                throw new ApiError('No payments found', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render(
                {
                    payments: payments,
                },
                {
                    statusCode: 200,
                }
            );
        }
    }

    async actionGetOne() {
        const self = this;

        let payment = null;
        let error = null;

        let where = {
            householdId: self.param('householdId'),
            id: self.param('id'),
        };

        try {
            payment = await self.db.Payment.findOne({
                where: where,
                include: self.db.Payment.extendInclude,
            });
            if (!payment) {
                throw new ApiError(
                    'No payment found with this id or you are not allowed to see it',
                    404
                );
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render({
                payment: payment,
            });
        }
    }

    async actionCreate() {
        const self = this;

        let remoteData = self.param('entry');
        let payment = null;
        let error = null;

        try {
            payment = await self.db.sequelize.transaction(async (t) => {
                let newPayment = self.db.Payment.build();

                remoteData['householdId'] = self.param('householdId');
                newPayment.writeRemotes(remoteData);

                await newPayment.save({
                    transaction: t,
                    lock: true,
                });

                return newPayment;
            });
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render(
                {
                    payment: payment,
                },
                {
                    statusCode: 201,
                }
            );
        }
    }
}

module.exports = ApiPaymentsController;
