const Controller = require('../mainController.js');
const ApiError = require('../../core/error.js');

class ApiHouseholdsController extends Controller {
    constructor(...args) {
        super(...args);
        const self = this;

        self.format = Controller.HTTP_FORMAT_JSON;

        // users have to signed in else they get a 401 Unauthorized response
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

    // GET for all households
    async actionGetAll() {
        const self = this;

        let error = null;
        let households = [];

        try {
            // find all categories
            households = await self.db.Household.findAll({
                attributes: ['id', 'createdAt', 'updatedAt', 'name', 'ownerId'],
                where: {},
            });
            if (!households) {
                throw new ApiError('No households found', 404);
            }
        } catch (err) {
            error = err;
        }
        // render either the error or the found households
        if (error) {
            self.handleError(error);
        } else {
            self.render(
                {
                    households: households,
                },
                {
                    statusCode: 200,
                }
            );
        }
    }

    // GET for one household with a specific id
    async actionGetOne() {
        const self = this;

        let householdId = self.param('id');
        let household = null;
        let error = null;

        try {
            // find the household with the given id
            household = await self.db.Household.findOne({
                attributes: ['id', 'createdAt', 'updatedAt', 'name', 'ownerId'],
                where: {
                    id: householdId,
                },
            });
            if (!household) {
                throw new ApiError('No household found with this id', 404);
            }
        } catch (err) {
            error = err;
        }

        // render either the error or the found household
        if (error) {
            self.handleError(error);
        } else {
            self.render({
                household: household,
            });
        }
    }

    // create the household with the send body (name)
    async actionCreate() {
        const self = this;

        let remoteData = self.param('household') || {};
        let household = null;
        let error = null;

        try {
            household = await self.db.sequelize.transaction(async (t) => {
                let newHousehold = self.db.Household.build();
                // create the household
                newHousehold.writeRemotes(remoteData);
                await newHousehold.save({
                    transaction: t,
                    lock: true,
                });

                return newHousehold;
            });
        } catch (err) {
            error = err;
        }

        // render either the error or the created household
        if (error) {
            self.handleError(error);
        } else {
            self.render(
                {
                    household: household,
                },
                {
                    statusCode: 201,
                }
            );
        }
    }

    //Update route for household
    async actionUpdate() {
        const self = this;

        let remoteData = self.param('household');

        let household = null;
        let error = null;

        //Get the household
        try {
            household = await self.db.sequelize.transaction(async (t) => {
                let updateHousehold = await self.db.Household.findOne(
                    {
                        where: {
                            id: remoteData.id,
                            ownerId: self.req.user.id,
                        },
                    },
                    { transaction: t }
                );
                if (updateHousehold) {
                    await updateHousehold.update(
                        {
                            name: remoteData.name,
                            ownerId: remoteData.ownerId,
                        },
                        {
                            where: {
                                id: remoteData.id,
                            },
                        },
                        { transaction: t, lock: true }
                    );
                }

                return updateHousehold;
            });
            if (!household) {
                throw new ApiError('Household could not be updated', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render(
                {
                    household: household,
                },
                {
                    statusCode: 202,
                }
            );
        }
    }

    // delete the household with the given id
    async actionDelete() {
        const self = this;

        let householdId = self.param('id');
        let error = null;

        // delete the household
        try {
            household = await self.db.sequelize.transaction(async (t) => {
                household = await self.db.Household.destroy(
                    {
                        where: {
                            id: householdId,
                            ownerId: self.req.user.id,
                        },
                    },
                    { transaction: t, lock: true }
                );

                return household;
            });
            // if no household was found with this id throw an error
            if (!household) {
                throw new ApiError(
                    'Found no household with given id or you do not have permissions',
                    404
                );
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

module.exports = ApiHouseholdsController;
