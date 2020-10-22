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
                where: {
                    senderId: self.req.user.id,
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

        let invitedEmail = self.param('email');

        if (!self.req.user.householdId) {
            throw new ApiError(
                'You cant invite because you are not in a household',
                400
            );
        }

        let invite = null;
        let error = null;
        let link = uuidv4();

        try {
            invite = await self.db.sequelize.transaction(async (t) => {
                let newInvite = self.db.Invite.build();

                let data = {
                    senderId: self.req.user.id,
                    link: link,
                };
                //newInvite.dataValues.senderId = self.req.user.id;
                newInvite.writeRemotes(data);
                await newInvite.save({
                    transaction: t,
                    lock: true,
                });

                //The email account used to invite other users has to be given in the .env file
                if (process.env.mailName && process.env.mailPassword) {
                    //Send an email to the invited person
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.mailName,
                            pass: process.env.mailPassword,
                        },
                    });

                    var mailOptions = {
                        from: process.env.mailName,
                        to: invitedEmail,
                        subject: 'Invite for Planbook',
                        text:
                            'Greetings from Planbook. You just have been invited by ' +
                            self.req.user.firstName +
                            ' ' +
                            self.req.user.lastName +
                            ' to join their household\nFor that you need to just register with this inviteCode ' +
                            newInvite.link +
                            ' on the website',
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                }

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

    //This route "uses" an invite link and sets the householdId of the user to the one which send the link
    async actionUpdate() {
        const self = this;

        let link = self.param('link');
        if (!link) {
            throw new ApiError('no invite found with this token', 400);
        }

        let invite = null;
        let error = null;

        //get the old todo
        try {
            invite = await self.db.sequelize.transaction(async (t) => {
                let updateInvite = await self.db.Invite.findOne(
                    {
                        where: {
                            link: link,
                        },
                    },
                    { transaction: t }
                );
                if (updateInvite) {
                    //Check if the invite was already used
                    if (
                        updateInvite.createdAt.getTime() !==
                        updateInvite.updatedAt.getTime()
                    ) {
                        throw new ApiError('Invite link was already used', 400);
                    }
                    //We now have to force updating only the updatedAt
                    //Without this the updatedAt would not be updated
                    updateInvite.changed('updatedAt', true);

                    await updateInvite.update(
                        {
                            updatedAt: new Date(),
                        },
                        {
                            where: {
                                link: link,
                            },
                        },
                        { transaction: t, lock: true }
                    );
                }

                return updateInvite;
            });
            if (!invite) {
                throw new ApiError('Invite could not be used', 404);
            }

            //Set the household id of the current user to the householdId of the invite sender
            //Get the sender.householdId
            let senderHouseholdId = await self.db.sequelize.transaction(
                async (t) => {
                    let sender = await self.db.User.findOne(
                        {
                            where: {
                                id: invite.senderId,
                            },
                        },
                        { transaction: t }
                    );
                    if (!sender) {
                        throw new ApiError(
                            'There was no corresponding user found to this invite',
                            404
                        );
                    }
                    return sender.householdId;
                }
            );

            //Now set the householdId of the current user to the one of the sender
            let currentUser = await self.db.sequelize.transaction(async (t) => {
                let updateUser = await self.db.User.findOne(
                    {
                        where: {
                            id: self.req.user.id,
                        },
                    },
                    { transaction: t }
                );
                if (!updateUser) {
                    throw new ApiError(
                        'There was an error and we could not find a user in our database with your id.\nPlease contact our support',
                        404
                    );
                } else {
                    await updateUser.update(
                        {
                            householdId: senderHouseholdId,
                        },
                        {
                            where: {
                                id: updateUser.id,
                            },
                        },
                        { transaction: t, lock: true }
                    );
                }

                return updateUser;
            });
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
}
module.exports = ApiInvitesController;
