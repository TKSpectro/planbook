const Controller = require('../mainController.js');
const ApiError = require('../../core/error.js');

class ApiCategoriesController extends Controller {
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

    // GET for all categories, if a name is send with the request only the category with that name gets returned
    async actionGetAll() {
        const self = this;

        let error = null;
        let category = null;
        let categories = [];

        // look if a name param was send
        let categoryName = self.param('name');
        // if it was then search for a category with this name
        if (categoryName) {
            try {
                // find one with the name
                category = await self.db.Category.findOne({
                    where: {
                        name: categoryName,
                    },
                    attributes: ['id', 'createdAt', 'updatedAt', 'name'],
                });
                // no category was found
                if (!category) {
                    throw new ApiError('No category found with this name', 404);
                }
            } catch (err) {
                error = err;
            }

            // render either the error or the found category
            if (error) {
                self.handleError(error);
            } else {
                self.render({
                    category: category,
                });
            }
            // no name given, find all categories and return them
        } else {
            try {
                // find all categories
                categories = await self.db.Category.findAll({
                    where: {},
                    attributes: ['id', 'createdAt', 'updatedAt', 'name'],
                });
                if (!categories) {
                    throw new ApiError('No categories found', 404);
                }
            } catch (err) {
                error = err;
            }
            // render either the error or the found categories
            if (error) {
                self.handleError(error);
            } else {
                self.render(
                    {
                        categories: categories,
                    },
                    {
                        statusCode: 200,
                    }
                );
            }
        }
    }

    // GET for one category with a specific id
    async actionGetOne() {
        const self = this;

        let categoryId = self.param('id');
        let category = null;
        let error = null;

        try {
            // find the category with the given id
            category = await self.db.Category.findOne({
                where: {
                    id: categoryId,
                },
                attributes: ['id', 'createdAt', 'updatedAt', 'name'],
            });
            if (!category) {
                throw new ApiError('No category found with this id', 404);
            }
        } catch (err) {
            error = err;
        }

        // render either the error or the found category
        if (error) {
            self.handleError(error);
        } else {
            self.render({
                category: category,
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

        let remoteData = self.param('category') || {};
        let category = null;
        let error = null;

        try {
            // check if there already exists a category with the same name
            category = await self.db.sequelize.transaction(async (t) => {
                let sameName = await self.db.Category.findOne({
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

                let newCategory = self.db.Category.build();
                // create the category
                newCategory.writeRemotes(remoteData);
                await newCategory.save({
                    transaction: t,
                    lock: true,
                });

                return newCategory;
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
                    category: category,
                },
                {
                    statusCode: 201,
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

module.exports = ApiCategoriesController;
