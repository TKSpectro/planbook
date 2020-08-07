const Controller = require('../mainController.js');
const Passport = require('../../core/passport.js');
const ApiError = require('../../core/error.js');

class ApiUsersController extends Controller {
    constructor(...args) {
        super(...args);
        const self = this;

        self.format = Controller.HTTP_FORMAT_JSON;

        //user needs to be authorized, else he will get 401: unauthorized
        //signin and signup can be called even when not authorized
        self.before(['*', '-signin', '-signup'], function (next) {
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

    async actionIndex() {
        const self = this;

        let users = [];
        let error = null;

        try {
            users = await self.db.User.findAll({
                where: {},
                attributes: [
                    'id',
                    'firstName',
                    'lastName',
                    'email',
                    'createdAt',
                    'updatedAt',
                ],
                include: self.db.User.extendInclude,
            });
            if (!users) {
                throw new ApiError('No users found', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render(
                {
                    users: users,
                },
                {
                    statusCode: 200,
                }
            );
        }
    }

    async actionShow() {
        const self = this;

        let userId = self.param('id');
        let user = null;
        let error = null;

        try {
            user = await self.db.User.findOne({
                where: {
                    id: userId,
                },
                attributes: [
                    'id',
                    'firstName',
                    'lastName',
                    'email',
                    'createdAt',
                    'updatedAt',
                ],
                include: self.db.User.extendInclude,
            });
            if (!user) {
                throw new ApiError('No user found with this id', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render({
                user: user,
            });
        }
    }

    async actionCreate() {
        const self = this;

        let remoteData = self.param('user');

        let user = null;
        let error = null;

        try {
            user = await self.db.sequelize.transaction(async (t) => {
                let newUser = self.db.User.build();
                newUser.writeRemotes(remoteData);

                await newUser.save({
                    transaction: t,
                    lock: true,
                });

                return newUser;
            });
            if (!user) {
                throw new ApiError('Could not create user', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render(
                {
                    user: user,
                },
                {
                    statusCode: 201,
                }
            );
        }
    }

    async actionUpdate() {
        const self = this;

        //check if the logged in person has the permission to update accounts (admin) or owns the account which will be updated
        if (
            Helper.checkPermission(
                Helper.canUpdateUser,
                self.req.user.permission
            ) ||
            self.param('id') === self.req.user.id
        ) {
            //user should be a object with all the values (new and old)
            let remoteData = self.param('user');
            let userId = self.param('id');

            let user = null;
            let error = null;

            //get the old user
            try {
                user = await self.db.sequelize.transaction(async (t) => {
                    let updatedUser = await self.db.User.findOne(
                        {
                            where: {
                                id: userId,
                            },
                        },
                        { transaction: t }
                    );
                    if (updatedUser) {
                        await updatedUser.update(
                            {
                                firstName: remoteData['firstName'],
                                lastName: remoteData['lastName'],
                                email: remoteData['email'],
                                passwordHash: remoteData['passwordHash'],
                                permission: remoteData['permission'],
                                updatedAt: new Date(),
                            },
                            {
                                where: {
                                    id: userId,
                                },
                            },
                            { transaction: t, lock: true }
                        );
                    }

                    return updatedUser;
                });
                if (!user) {
                    throw new ApiError('User could not be updated', 404);
                }
            } catch (err) {
                error = err;
            }

            if (error) {
                self.handleError(error);
            } else {
                self.render(
                    {
                        user: user,
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

    async actionDelete() {
        const self = this;

        //check if the logged in person has the permission to delete accounts (admin) or owns the account which will be deleted
        if (
            Helper.checkPermission(
                Helper.canDeleteUser,
                self.req.user.permission
            ) ||
            self.param('id') === self.req.user.id
        ) {
            // user wont actually be deleted but will get anonymized
            // firstName -> 'deleted'
            // lastName -> 'deleted'
            // email -> 'deleted'
            // password -> 'deleted'

            let userId = self.param('id');

            let user = null;
            let error = null;

            //get the old user
            try {
                user = await self.db.sequelize.transaction(async (t) => {
                    let updatedUser = await self.db.User.findOne(
                        {
                            where: {
                                id: userId,
                            },
                        },
                        { transaction: t }
                    );
                    if (updatedUser) {
                        await updatedUser.update(
                            {
                                firstName: 'deleted',
                                lastName: 'deleted',
                                email: 'deleted',
                                passwordHash: 'deleted',
                                permission: 1,
                                updatedAt: new Date(),
                            },
                            {
                                where: {
                                    id: userId,
                                },
                            },
                            { transaction: t, lock: true }
                        );
                    }

                    return updatedUser;
                });
                if (!user) {
                    throw new ApiError('User could not be deleted', 404);
                }
            } catch (err) {
                error = err;
            }

            if (error) {
                self.handleError(error);
            } else {
                self.render(
                    {
                        user: 'deleted',
                    },
                    {
                        statusCode: 204,
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

    async actionSignin() {
        const self = this;
        let remoteData = self.param('user') || {};

        let user = null;
        let error = null;

        try {
            user = await self.db.User.findOne({
                where: {
                    email: remoteData.email,
                },
            });
            if (
                !user ||
                !Passport.comparePassword(
                    remoteData.password,
                    user.passwordHash
                )
            ) {
                throw new ApiError(
                    'Could not find user with this email or password.',
                    404
                );
            }
            if (Helper.checkPermission(Helper.isUserDeleted, user.permission)) {
                throw new ApiError(
                    'Could not login. Account is marked as deleted.',
                    403
                );
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            let token = Passport.authorizeUserWithCookie(
                self.req,
                self.res,
                user.id
            );

            self.render(
                {
                    token: token,
                },
                {
                    statusCode: 200,
                }
            );
        }
    }

    async actionSignup() {
        const self = this;

        let remoteData = self.param('user');
        let user = null;
        let error = null;

        try {
            user = await self.db.sequelize.transaction(async (t) => {
                let sameMail = await self.db.User.findOne({
                    where: {
                        email: remoteData.email,
                    },
                    lock: true,
                    transaction: t,
                });

                if (sameMail) {
                    throw new ApiError('Mail already in use', 400);
                }

                let newUser = self.db.User.build();
                //give user the permission to create projects and tasks
                remoteData['permission'] = 0b0000000000010010;

                newUser.writeRemotes(remoteData);
                await newUser.save({
                    transaction: t,
                    lock: true,
                });

                return newUser;
            });
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render(
                {
                    user: user,
                },
                {
                    statusCode: 201,
                }
            );
        }
    }

    async actionSignout() {
        const self = this;

        let error = null;

        if (error) {
            self.handleError(error);
        } else {
            Passport.unauthorizeUser(self.req, self.res);

            self.render();
        }
    }
}

module.exports = ApiUsersController;
