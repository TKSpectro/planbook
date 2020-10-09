const Controller = require('../mainController.js');
const ApiError = require('../../core/error.js');
const { Op } = require('sequelize');

class ApiEntriesController extends Controller {
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

    // you get all entries which are saved for your household
    async actionGetAll() {
        const self = this;

        // get filter attributes from the url params
        const timeStampStart = self.param('start') || null;
        const timeStampEnd = self.param('end') || null;
        const category = self.param('category') || null;

        // define the where clause for the sql query
        let where = {
            householdId: self.req.user.householdId,
        };
        // check if the user gave any further parameters
        // add it to the query-where
        if (timeStampStart) {
            where['startDate'] = {
                [Op.gte]: new Date(timeStampStart),
            };
        }
        if (timeStampEnd) {
            where['endDate'] = {
                // endDate can be smaller than timeStampEnd or be null (there was no EndDate set)
                [Op.or]: {
                    [Op.lte]: new Date(timeStampEnd),
                    [Op.eq]: null,
                },
            };
        }

        let entries = [];
        let error = null;

        try {
            entries = await self.db.Entry.findAll({
                include: self.db.Entry.extendInclude,
                where: where,
            });
            if (!entries.toString()) {
                // throw a custom error if there were parameters set by the user
                if (timeStampStart || timeStampEnd || category) {
                    throw new ApiError(
                        'No entries found with your set parameters:',
                        404
                    );
                }
                // throw a standard 404 nothing found
                throw new ApiError('No entries found', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render(
                {
                    entries: entries,
                },
                {
                    statusCode: 200,
                }
            );
        }
    }

    async actionGetOne() {
        const self = this;

        let entryId = self.param('id');
        let entry = null;
        let error = null;

        try {
            entry = await self.db.Entry.findOne({
                where: {
                    id: entryId,
                    householdId: self.req.user.householdId,
                },
                include: self.db.Entry.extendInclude,
            });
            if (!entry) {
                throw new ApiError(
                    'No entry found with this id or you are not allowed to see it',
                    404
                );
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render({
                entry: entry,
            });
        }
    }

    async actionCreate() {
        const self = this;

        let remoteData = self.param('entry');
        let entry = null;
        let error = null;

        try {
            entry = await self.db.sequelize.transaction(async (t) => {
                let newEntry = self.db.Entry.build();

                //user does not have to send householdId, we just use the household in which the user is part of
                remoteData['householdId'] = self.req.user.householdId;
                newEntry.writeRemotes(remoteData);

                await newEntry.save({
                    transaction: t,
                    lock: true,
                });

                return newEntry;
            });
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render(
                {
                    entry: entry,
                },
                {
                    statusCode: 201,
                }
            );
        }
    }

    async actionUpdate() {
        const self = this;

        let remoteData = self.param('entry');
        let entryId = self.param('id');

        let entry = null;
        let error = null;

        //get the old entry
        try {
            entry = await self.db.sequelize.transaction(async (t) => {
                let updateEntry = await self.db.Entry.findOne(
                    {
                        where: {
                            id: entryId,
                            householdId: self.req.user.householdId,
                        },
                    },
                    { transaction: t }
                );
                if (updateEntry) {
                    await updateEntry.update(
                        {
                            updatedAt: new Date(),
                            endDate: remoteData['endDate'],
                            income: remoteData['income'],
                            value: remoteData['value'],
                            purpose: remoteData['purpose'],
                            interval: remoteData['interval'],
                        },
                        {
                            where: {
                                id: entryId,
                            },
                        },
                        { transaction: t, lock: true }
                    );
                }

                return updateEntry;
            });
            if (!remoteData) {
                throw new ApiError('no entry object in body found', 400);
            }
            if (!entry) {
                throw new ApiError('Entry could not be updated', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render(
                {
                    entry: entry,
                },
                {
                    statusCode: 202,
                }
            );
        }
    }

    async actionDelete() {
        const self = this;

        let entry = null;
        let entryId = self.param('id');
        let error = null;

        // delete the category
        try {
            entry = await self.db.sequelize.transaction(async (t) => {
                entry = await self.db.Entry.destroy(
                    {
                        where: {
                            id: entryId,
                            householdId: self.req.user.householdId,
                        },
                    },
                    { transaction: t, lock: true }
                );

                return entry;
            });
            // if no category was found with this id throw an error
            if (!entry) {
                throw new ApiError('Found no entry for given id', 404);
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

module.exports = ApiEntriesController;
