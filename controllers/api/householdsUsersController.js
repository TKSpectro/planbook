const Controller = require('../mainController.js');
const ApiError = require('../../core/error.js');

class ApiHouseholdsUsersController extends Controller {
    constructor(...args) {
        super(...args);
        const self = this;

        self.format = Controller.HTTP_FORMAT_JSON;

        // users have to signed in else they get a 401 Unauthorized response
        self.before(['*', '-getAll', '-create'], async function (next) {
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

        self.before(['getAll', 'create'], async function (next) {
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
            let where = {};
            let include;
            const householdId = self.param('hid');
            if (householdId) {
                where['householdId'] = self.param('hid');
                include = self.db.HouseholdUser.extendInclude;
            } else {
                where['userId'] = self.req.user.id;
                include = self.db.HouseholdUser.extendIncludeHousehold;
            }

            households = await self.db.HouseholdUser.findAll({
                where: where,
                include: include,
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

    // TODO check if the connection already exists
    async actionCreate() {
        const self = this;

        let remoteData = self.param('householdUser') || {};
        let householdUser;
        let error;

        try {
            householdUser = await self.db.sequelize.transaction(async (t) => {
                let newHouseholdUser = self.db.HouseholdUser.build();
                // create the household
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

        // render either the error or the created household
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

    // delete the householdUser with the given id
    async actionDelete() {
        const self = this;

        let error = null;
        const householdId = self.param('hid');
        const userId = self.param('id');

        // delete the householdUser
        try {
            if (!userId) {
                throw new ApiError('No userId given', 400);
            }

            // Find the requester user account and check if he is the owner of the household
            const household = await self.db.Household.findOne({
                where: {
                    id: householdId,
                },
            });

            if (self.req.user.id != household.ownerId) {
                throw new ApiError('You are not the household owner', 400);
            }

            const householdUser = await self.db.sequelize.transaction(
                async (t) => {
                    const householdUser = await self.db.HouseholdUser.destroy(
                        {
                            where: {
                                householdId: householdId,
                                userId: userId,
                            },
                        },
                        { transaction: t, lock: true }
                    );

                    return householdUser;
                }
            );
            if (householdUser != 1) {
                throw new ApiError(
                    'Could not remove member from household',
                    400
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

module.exports = ApiHouseholdsUsersController;
