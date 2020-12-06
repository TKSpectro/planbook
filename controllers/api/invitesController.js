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
        // Set valid until either from param or set it to 1 day
        let validUntil =
            self.param('validUntil') || new Date() + 1000 * 60 * 60 * 1;

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
                    validUntil: validUntil,
                    wasUsed: false,
                    invitedEmail: invitedEmail,
                    link: link,
                };
                //newInvite.dataValues.senderId = self.req.user.id;
                newInvite.writeRemotes(data);
                await newInvite.save({
                    transaction: t,
                    lock: true,
                });

                // SEND OUT AN EMAIL
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
                // END EMAIL SENDING
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
                            wasUsed: true,
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
            let householdUser = await self.db.sequelize.transaction(
                async (t) => {
                    let newHouseholdUser = self.db.HouseholdUser.build();

                    let data = {
                        timeJoined: new Date(),
                        householdId: invite.householdId,
                        userId: self.req.user.id,
                    };
                    //newInvite.dataValues.senderId = self.req.user.id;
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
                    return sender.householdId;
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
}
module.exports = ApiInvitesController;
