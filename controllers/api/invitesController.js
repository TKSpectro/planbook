const Controller = require('../mainController.js');
const ApiError = require('../../core/error.js');
require('dotenv').config();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const { up } = require('../../src/db/migrations/1501-create-invite.js');

class ApiInvitesController extends Controller {
    constructor(...args) {
        super(...args);
        const self = this;

        self.format = Controller.HTTP_FORMAT_JSON;

        self.before(['*', '-update'], async function (next) {
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

        self.before(['update'], async function (next) {
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
            const householdId = self.param('hid');

            invites = await self.db.Invite.findAll({
                include: self.db.Invite.extendInclude,
                where: {
                    householdId: householdId,
                },
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

    //Creating a new invite
    async actionCreate() {
        const self = this;

        let invite = null;
        let error = null;
        try {
            // Get the remote data and check if its valid
            let remoteData = self.param('invite');
            if (!remoteData) {
                throw new ApiError('no invite object found in body', 400);
            }

            // Set remoteData params
            remoteData['householdId'] = self.param('hid');
            remoteData['senderId'] = self.req.user.id;

            // Set valid until either from param or set it to 1 week
            let validUntil = new Date();
            validUntil.setDate(validUntil.getDate() + 7);

            remoteData['validUntil'] = validUntil;
            remoteData['wasUsed'] = false;

            // Set the link to a random generated one
            remoteData['link'] = uuidv4();

            invite = await self.db.sequelize.transaction(async (t) => {
                let newInvite = self.db.Invite.build();

                //newInvite.dataValues.senderId = self.req.user.id;
                newInvite.writeRemotes(remoteData);
                await newInvite.save({
                    transaction: t,
                    lock: true,
                });

                return newInvite;
            });

            // SEND OUT AN EMAIL
            // The email account used to invite other users has to be given in the .env file
            if (
                process.env.MAIL_NAME &&
                process.env.MAIL_PASSWORD &&
                !process.env.MAIL_SEND
            ) {
                //Send an email to the invited person
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.MAIL_NAME,
                        pass: process.env.MAIL_PASSWORD,
                    },
                });

                var mailOptions = {
                    from: process.env.MAIL_NAME,
                    to: invite.invitedEmail,
                    subject: 'Invite for Planbook',
                    text:
                        'Greetings from Planbook. You just have been invited by ' +
                        self.req.user.firstName +
                        ' ' +
                        self.req.user.lastName +
                        ' to join their household\nFor that you need to just register with this inviteCode ' +
                        invite.link +
                        ' on the website',
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                    }
                });
            }
            // END EMAIL SENDING
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

    //This route "uses" an invite link and sets the householdId of the user to the one which send the link
    async actionUpdate() {
        const self = this;

        let invite = null;
        let error = null;

        try {
            if (!self.param('invite')) {
                throw new ApiError('no invite in body found', 400);
            }
            if (!self.param('invite').link) {
                throw new ApiError('no link in body found', 400);
            }

            const link = self.param('invite').link;

            invite = await self.db.sequelize.transaction(async (t) => {
                let updateInvite = await self.db.Invite.findOne(
                    {
                        where: {
                            link: link,
                        },
                    },
                    { transaction: t }
                );

                if (!updateInvite) {
                    throw new ApiError(
                        'There is no invite existing with this link',
                        400
                    );
                }

                //Check if the invite was already used
                if (updateInvite.wasUsed === true) {
                    throw new ApiError('Invite link was already used', 400);
                }

                //We now have to force updating only the updatedAt
                //Without this the updatedAt would not be updated
                updateInvite.changed('updatedAt', true);

                await updateInvite.update(
                    {
                        updatedAt: new Date(),
                        wasUsed: true,
                    },
                    {
                        where: {
                            link: link,
                        },
                    },
                    { transaction: t, lock: true }
                );

                return updateInvite;
            });

            if (!invite) {
                throw new ApiError('Invite could not be used', 404);
            }

            if (invite.invitedEmail != self.req.user.email) {
                throw new ApiError(
                    'This invite was not created for you account email.',
                    400
                );
            }

            const alreadyInHousehold = await self.db.HouseholdUser.findOne({
                where: {
                    householdId: invite.householdId,
                    userId: self.req.user.id,
                },
            });
            if (alreadyInHousehold) {
                throw new ApiError(
                    'Invite was used but you were already in this household',
                    400
                );
            }

            let householdUser = await self.db.sequelize.transaction(
                async (t) => {
                    let newHouseholdUser = self.db.HouseholdUser.build();

                    let data = {
                        timeJoined: new Date(),
                        householdId: invite.householdId,
                        userId: self.req.user.id,
                    };

                    newHouseholdUser.writeRemotes(data);
                    await newHouseholdUser.save({
                        transaction: t,
                        lock: true,
                    });
                    if (!newHouseholdUser) {
                        throw new ApiError(
                            'Could not associate user with household',
                            404
                        );
                    }
                    return newHouseholdUser.householdId;
                }
            );
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render(
                {
                    response: 'Yay, you have joined the Household',
                },
                {
                    statusCode: 202,
                }
            );
        }
    }

    async actionDelete() {
        const self = this;

        let invite = null;
        let error = null;
        // delete the category
        try {
            if (!self.param('id')) {
                throw new ApiError('No id given', 400);
            }

            invite = await self.db.sequelize.transaction(async (t) => {
                invite = await self.db.Invite.destroy(
                    {
                        where: {
                            householdId: self.param('hid'),
                            id: self.param('id'),
                        },
                    },
                    { transaction: t, lock: true }
                );

                return invite;
            });
            // if no category was found with this id throw an error
            if (!invite) {
                throw new ApiError('Found no invite for given id', 404);
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
module.exports = ApiInvitesController;
