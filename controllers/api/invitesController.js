const Controller = require('../mainController.js');
const ApiError = require('../../core/error.js');

class ApiInvitesController extends Controller {
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

    async actionGetAll() {
        const self = this;

        let invites = [];
        let error = null;

        try {
            invites = await self.db.Invite.findAll({
                include: self.db.Invite.extendInclude,
            });
            if (!invites) {
                throw new ApiError('No invites found', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render(
                {
                    invites: invites,
                },
                {
                    statusCode: 200,
                }
            );
        }
    }

    async actionGetOne() {
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

        let invitedEmail = self.param('email');

        let invitedHouseholdId = self.req.user.householdId;
        if (!invitedHouseholdId) {
            throw new ApiError(
                'You cant invite because you are not in a household',
                400
            );
        }

        let invite = null;
        let error = null;

        try {
            invite = await self.db.sequelize.transaction(async (t) => {
                let sameMail = await self.db.Invite.findOne({
                    where: {
                        email: invitedEmail,
                    },
                    transaction: t,
                });

                if (sameMail) {
                    throw new ApiError('This EMail was already invited', 400);
                }

                let newInvite = self.db.Invite.build();

                let data = {
                    email: invitedEmail,
                    householdId: invitedHouseholdId,
                };
                newInvite.writeRemotes(data);
                await newInvite.save({
                    transaction: t,
                    lock: true,
                    include: self.db.Invite.extendInclude,
                });

                return newInvite;
            });
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render(
                {
                    invite: invite,
                },
                {
                    statusCode: 201,
                }
            );
        }
    }
}

module.exports = ApiInvitesController;
