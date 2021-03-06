const Controller = require('../mainController.js');
const ApiError = require('../../core/error.js');
require('dotenv').config();

class ApiMoneypoolsController extends Controller {
    constructor(...args) {
        super(...args);
        const self = this;

        self.format = Controller.HTTP_FORMAT_JSON;

        self.before(['*'], async function (next) {
            let householdUser;
            if (self.req.authorized === true && self.param('hid')) {
                householdUser = await self.db.HouseholdUser.findOne({
                    where: {
                        userId: self.req.user.id,
                        householdId: self.param('hid'),
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

    // GET all moneypools for the selected household
    async actionGet() {
        const self = this;

        let moneypools;
        let error = null;
        try {
            let where = { householdId: self.param('hid') };
            let include = self.db.Moneypool.extendIncludeHousehold;

            if (self.param('id')) {
                where['id'] = self.param('id');
                include = self.db.Moneypool.extendInclude;
            }

            moneypools = await self.db.Moneypool.findAll({
                include: include,
                where: where,
            });

            if (moneypools.length < 1) {
                throw new ApiError('No moneypools found.', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render(
                {
                    moneypools: moneypools,
                },
                {
                    statusCode: 200,
                }
            );
        }
    }

    async actionCreate() {
        const self = this;

        let moneypool = null;
        let error = null;

        try {
            if (!self.param('moneypool')) {
                throw new ApiError('No body or wrong body', 400);
            }

            let remoteData = self.param('moneypool');

            remoteData['householdId'] = self.param('hid');

            moneypool = await self.db.sequelize.transaction(async (t) => {
                let newMoneypool = self.db.Moneypool.build();

                newMoneypool.writeRemotes(remoteData);

                await newMoneypool.save({
                    transaction: t,
                    lock: true,
                });

                return newMoneypool;
            });
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render(
                {
                    moneypool: moneypool,
                },
                {
                    statusCode: 201,
                }
            );
        }
    }

    async actionUpdate() {
        const self = this;

        let moneypool;
        let error;

        try {
            let remoteData = self.param('moneypool');
            if (!remoteData) {
                throw new ApiError('no moneypool object found in body', 400);
            }
            const householdId = self.param('hid');
            const moneypoolId = self.param('id');
            if (!moneypoolId) {
                throw new ApiError('no id was send', 400);
            }

            moneypool = await self.db.sequelize.transaction(async (t) => {
                let updatedMoneypool = await self.db.Moneypool.findOne(
                    {
                        where: {
                            id: moneypoolId,
                            householdId: householdId,
                        },
                    },
                    { transaction: t }
                );
                if (updatedMoneypool) {
                    await updatedMoneypool.update(
                        {
                            updatedAt: new Date(),
                            name: remoteData['name'],
                            description: remoteData['description'],
                            totalNeededMoney: remoteData['totalNeededMoney'],
                        },
                        {
                            where: {
                                id: moneypoolId,
                            },
                        },
                        { transaction: t, lock: true }
                    );
                }

                return updatedMoneypool;
            });

            if (!moneypool) {
                throw new ApiError('Moneypool could not be updated', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render(
                {
                    moneypool: moneypool,
                },
                {
                    statusCode: 202,
                }
            );
        }
    }
}
module.exports = ApiMoneypoolsController;
