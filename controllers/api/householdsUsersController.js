const Controller = require('../mainController.js');
const ApiError = require('../../core/error.js');

class ApiHouseholdsUsersController extends Controller {
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

    // GET all households in which you are present
    async actionGetAll() {
        const self = this;

        let error = null;
        let households = [];

        try {
            households = await self.db.HouseholdUser.findAll({
                where: {
                    userId: self.req.user.id,
                },
                include: self.db.HouseholdUser.extendIncludeHousehold,
                attributes: ['userId', 'householdId'],
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

    // create the household with the send body (name)
    async actionCreate() {
        const self = this;

        let remoteData = self.param('household') || {};
        let householdUser = null;
        let error = null;

        try {
            householdUser = await self.db.sequelize.transaction(async (t) => {
                let newHouseholdUser = self.db.HouseholdUser.build();
                newHouseholdUser.writeRemotes(remoteData);
                await newHouseholdUser.save({
                    transaction: t,
                    lock: true,
                });

                return newHouseholdUser;
            });
        } catch (err) {
            error = err;
        }

        // render either the error or the created householdUser
        if (error) {
            self.handleError(error);
        } else {
            self.render(
                {
                    householdUser: householdUser,
                },
                {
                    statusCode: 201,
                }
            );
        }
    }

    //Update route for householdUser
    async actionUpdate() {
        const self = this;

        let remoteData = self.param('householdUser');
        let householdUserId = self.param('id');
        let householdUser = null;
        let error = null;

        //Get the household
        try {
            householdUser = await self.db.sequelize.transaction(async (t) => {
                let updateHouseholdUser = await self.db.HouseholdUser.findOne(
                    {
                        include: self.db.HouseholdUser.extendIncludeHousehold,
                        where: {
                            id: householdUserId,
                        },
                    },
                    { transaction: t }
                );
                if (updateHouseholdUser) {
                    let household = await self.db.Household.findOne(
                        {
                            where: {
                                id: updateHouseholdUser.householdId,
                            },
                        },
                        { transaction: t }
                    );
                    // only the owner is able to update the timeJoined
                    if (household.ownerId != self.req.user.id) {
                        throw new ApiError(
                            'You are not the owner of the household, so you cant update it',
                            403
                        );
                    }
                    await updateHouseholdUser.update(
                        {
                            timeJoined: remoteData.timeJoined,
                        },
                        {
                            where: {
                                id: householdUserId,
                            },
                        },
                        { transaction: t, lock: true }
                    );
                }

                return updateHouseholdUser;
            });
            if (!householdUser) {
                throw new ApiError('HouseholdUser could not be updated', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render(
                {
                    householdUser: householdUser,
                },
                {
                    statusCode: 202,
                }
            );
        }
    }

    // delete the householdUser with the given id
    async actionDelete() {
        const self = this;

        let householdUser;
        let householdUserId = self.param('id');
        let error = null;

        // delete the householdUser
        try {
            householdUser = await self.db.sequelize.transaction(async (t) => {
                let updateHouseholdUser = await self.db.HouseholdUser.findOne(
                    {
                        include: self.db.HouseholdUser.extendIncludeHousehold,
                        where: {
                            id: householdUserId,
                        },
                    },
                    { transaction: t }
                );
                if (updateHouseholdUser) {
                    let household = await self.db.Household.findOne(
                        {
                            where: {
                                id: updateHouseholdUser.householdId,
                            },
                        },
                        { transaction: t }
                    );
                    // only the owner is able to update the timeJoined
                    if (
                        household.ownerId == self.req.user.id ||
                        updateHouseholdUser.userId == self.req.user.id
                    ) {
                        householdUser = await self.db.sequelize.transaction(
                            async (t) => {
                                household = await self.db.HouseholdUser.destroy(
                                    {
                                        where: {
                                            id: householdUserId,
                                        },
                                    },
                                    { transaction: t, lock: true }
                                );

                                return householdUser;
                            }
                        );
                    } else {
                        throw new ApiError(
                            'You are not the owner of the household, so you cant update it',
                            403
                        );
                    }
                }
            });
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

module.exports = ApiHouseholdsUsersController;
