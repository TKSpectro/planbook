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

    /* 
    There is no update for categories, 
    because only the name could be change and that is not really allowed
    */

    // create the category with the send body (name)
    async actionCreate() {
        const self = this;

        let remoteData = self.param('household') || {};
        let household = null;
        let error = null;

        try {
            // check if there already exists a category with the same name
            household = await self.db.sequelize.transaction(async (t) => {
                let sameName = await self.db.Household.findOne({
                    where: {
                        name: remoteData.name,
                    },
                    attributes: ['id', 'createdAt', 'updatedAt', 'name'],
                    lock: true,
                    transaction: t,
                });
                // if it exists then throw an error
                if (sameName) {
                    throw new ApiError('Name already in use', 400);
                }

                let newHousehold = self.db.Household.build();
                // create the category
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

        // render either the error or the created category
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

        if (self.req.user.householdId) {
            let remoteData = self.param('household');

            let household = null;
            let error = null;

            //Get the household
            try {
                household = await self.db.sequelize.transaction(async (t) => {
                    let updateHousehold = await self.db.Household.findOne(
                        {
                            where: {
                                id: self.req.user.householdId,
                            },
                        },
                        { transaction: t }
                    );
                    if (updateHousehold) {
                        await updateHousehold.update(
                            {
                                name: remoteData.name,
                            },
                            {
                                where: {
                                    id: self.req.user.householdId,
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
        } else {
            self.render(
                {},
                {
                    statusCode: 403,
                }
            );
        }
    }

    // delete the category with the given id
    async actionDelete() {
        const self = this;

        let categoryId = self.param('id');
        let category = null;
        let error = null;

        // delete the category
        try {
            category = await self.db.sequelize.transaction(async (t) => {
                category = await self.db.Category.destroy(
                    {
                        where: {
                            id: categoryId,
                        },
                    },
                    { transaction: t, lock: true }
                );

                return category;
            });
            // if no category was found with this id throw an error
            if (!category) {
                throw new ApiError('Found no category with given id', 404);
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
