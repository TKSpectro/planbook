const Controller = require('../mainController.js');
const ApiError = require('../../core/error.js');
require('dotenv').config();
const nodemailer = require('nodemailer');

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

        let inviteId = self.param('id');
        let invite = null;
        let error = null;

        try {
            invite = await self.db.Invite.findOne({
                where: {
                    id: inviteId,
                },
                include: self.db.Invite.extendInclude,
            });
            if (!invite) {
                throw new ApiError('No invite found with this id', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render({
                invite: invite,
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
                        to: data.email,
                        subject: 'Invite for Planbook',
                        text:
                            'Greetings from Planbook. You just have been invited by ' +
                            data.email +
                            ' to join their household\nFor that you need to just register with this email on the website',
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

    async actionDelete() {
        const self = this;

        let inviteEmail = self.param('email');
        let invite = null;
        let error = null;

        // delete the category
        try {
            invite = await self.db.sequelize.transaction(async (t) => {
                invite = await self.db.Invite.destroy(
                    {
                        where: {
                            email: inviteEmail,
                        },
                    },
                    { transaction: t, lock: true }
                );

                return invite;
            });
            // if no category was found with this id throw an error
            if (!invite) {
                throw new ApiError('Found no invite for given email', 404);
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
