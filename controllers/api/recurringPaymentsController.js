const Controller = require('../mainController.js');
const ApiError = require('../../core/error.js');
const { Op } = require('sequelize');

class ApiRecurringPaymentsController extends Controller {
    constructor(...args) {
        super(...args);
        const self = this;

        self.format = Controller.HTTP_FORMAT_JSON;

        // users have to be signed in else they a 401 Unauthorized response
        self.before(['*'], async function (next) {
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

            if (self.req.authorized === true && householdUser) {
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

    // you get all recurringPayments which are saved for your household
    async actionGetAll() {
        const self = this;
        let error = null;
        let recurringPayments;

        try {
            let where = { householdId: self.param('hid') };

            if (self.param('start')) {
                where['startDate'] = {
                    [Op.lte]: new Date(self.param('start')),
                };
            }

            let limit;
            let order;
            if (self.param('limit')) {
                limit = Number(self.param('limit'));
                order = [['startDate', 'ASC']];
            }

            recurringPayments = await self.db.RecurringPayment.findAll({
                include: self.db.RecurringPayment.extendInclude,
                where: where,
                limit: limit,
                order: order,
            });
            if (!recurringPayments) {
                throw new ApiError('No recurringPayments found', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render(
                {
                    recurringPayments: recurringPayments,
                },
                {
                    statusCode: 200,
                }
            );
        }
    }

    async actionCreate() {
        const self = this;

        let error = null;
        let recurringPayment = null;

        try {
            let remoteData = self.param('recurringPayment');
            if (!remoteData) {
                throw new ApiError('no recurringPayment object found in body', 400);
            }
            remoteData['householdId'] = self.param('hid');

            recurringPayment = await self.db.sequelize.transaction(async (t) => {
                let newRecurringPayment = self.db.RecurringPayment.build();

                newRecurringPayment.writeRemotes(remoteData);

                await newRecurringPayment.save({
                    transaction: t,
                    lock: true,
                });

                return newRecurringPayment;
            });
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render(
                {
                    recurringPayment: recurringPayment,
                },
                {
                    statusCode: 201,
                }
            );
        }
    }

    async actionUpdate() {
        const self = this;
        let error = null;

        let recurringPayment = null;
        //get the old recurringPayment
        try {
            let remoteData = self.param('recurringPayment');
            if (!remoteData) {
                throw new ApiError('no recurringPayment object found in body', 400);
            }

            const recurringPaymentId = self.param('id');
            if (!recurringPaymentId) {
                throw new ApiError('no id was send', 400);
            }

            // Need to set it manually null else we get a invalid date in the database
            if (!remoteData['endDate']) {
                remoteData['endDate'] = null;
            }

            recurringPayment = await self.db.sequelize.transaction(async (t) => {
                let updateRecurringPayment = await self.db.RecurringPayment.findOne(
                    {
                        where: {
                            id: recurringPaymentId,
                            householdId: self.param('hid'),
                        },
                    },
                    { transaction: t }
                );
                if (updateRecurringPayment) {
                    await updateRecurringPayment.update(
                        {
                            updatedAt: new Date(),
                            startDate: remoteData['startDate'],
                            endDate: remoteData['endDate'],
                            value: remoteData['value'],
                            purpose: remoteData['purpose'],
                            interval: remoteData['interval'],
                            categoryId: remoteData['categoryId'],
                        },
                        {
                            where: {
                                id: recurringPaymentId,
                            },
                        },
                        { transaction: t, lock: true }
                    );
                }

                return updateRecurringPayment;
            });

            if (!recurringPayment) {
                throw new ApiError('RecurringPayment could not be updated', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render(
                {
                    recurringPayment: recurringPayment,
                },
                {
                    statusCode: 202,
                }
            );
        }
    }

    async actionDelete() {
        const self = this;

        let recurringPayment = null;
        let error = null;
        // delete the category
        try {
            if (!self.param('id')) {
                throw new ApiError('No id given', 400);
            }

            recurringPayment = await self.db.sequelize.transaction(async (t) => {
                recurringPayment = await self.db.RecurringPayment.destroy(
                    {
                        where: {
                            id: self.param('id'),
                        },
                    },
                    { transaction: t, lock: true }
                );

                return recurringPayment;
            });
            // if no category was found with this id throw an error
            if (!recurringPayment) {
                throw new ApiError('Found no recurringPayment for given id', 404);
            }
        } catch (err) {
            error = err;
        }

        // render either the error or 204 No-Content
        if (error) {
            self.handleError(error);
        } else {
            self.render(
                {},
                {
                    statusCode: 204,
                }
            );
        }
    }
}

module.exports = ApiRecurringPaymentsController;
