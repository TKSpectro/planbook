const Controller = require('../mainController.js');
const ApiError = require('../../core/error.js');
const { Op } = require('sequelize');

class ApiPaymentsController extends Controller {
    constructor(...args) {
        super(...args);
        const self = this;

        self.format = Controller.HTTP_FORMAT_JSON;

        self.before(['*'], async function (next) {
            if (self.req.authorized !== true) {
                self.render(
                    {},
                    {
                        statusCode: 401,
                    }
                );
            }

            const householdId = self.param('hid');
            let householdUser;
            if (householdId) {
                householdUser = await self.db.HouseholdUser.findOne({
                    where: {
                        userId: self.req.user.id,
                        householdId: householdId,
                    },
                });
            }

            if (householdUser) {
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

        let payments;
        let error = null;
        try {
            let where = { householdId: self.param('hid') };

            if (self.param('start') && self.param('end')) {
                where['createdAt'] = {
                    [Op.gte]: new Date(self.param('start')),
                    [Op.lte]: new Date(self.param('end')),
                };
            } else if (self.param('start')) {
                where['createdAt'] = {
                    [Op.gte]: new Date(self.param('start')),
                };
            } else if (self.param('end')) {
                where['createdAt'] = {
                    [Op.lte]: new Date(self.param('end')),
                };
            }

            if (self.param('moneypoolId')) {
                if (self.param('moneypoolId') == 'null') {
                    where['moneypoolId'] = { [Op.is]: null };
                } else {
                    where['moneypoolId'] = self.param('moneypoolId');
                }
            }

            if (self.param('id')) {
                where['id'] = self.param('id');
            }

            let limit;
            if (self.param('limit')) {
                limit = Number(self.param('limit'));
            }

            payments = await self.db.Payment.findAll({
                include: self.db.Payment.extendInclude,
                where: where,
                order: [['createdAt', 'DESC']],
                limit: limit,
            });

            if (!payments) {
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

    async actionCreate() {
        const self = this;

        let payment = null;
        let error = null;

        try {
            if (!self.param('payment')) {
                throw new ApiError('No body or wrong body', 400);
            }

            let remoteData = self.param('payment');

            if (remoteData['moneypoolId']) {
                remoteData['userId'] = self.req.user.id;
            }

            payment = await self.db.sequelize.transaction(async (t) => {
                let newPayment = self.db.Payment.build();

                remoteData['householdId'] = self.param('hid');
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
