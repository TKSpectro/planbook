const Controller = require('../mainController.js');
const ApiError = require('../../core/error.js');

class ApiCategoriesController extends Controller {
    constructor(...args) {
        super(...args);
        const self = this;

        self.format = Controller.HTTP_FORMAT_JSON;

        //Users have to bw signed in else they get a 401 Unauthorized response
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

    //GET for all categories, if parameter id is given just return the one category with this id
    async actionGetAll() {
        const self = this;

        let error;
        let categories;

        try {
            let where = {};

            const categoryId = self.param('id');
            if (categoryId) {
                where['id'] = categoryId;
            }

            categories = await self.db.Category.findAll({
                where: where,
            });

            if (!categories) {
                throw new ApiError('No categories found', 404);
            }
        } catch (err) {
            error = err;
        }
        //Render either the error or the found categories
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

    // create the category with the send body (name)
    async actionCreate() {
        const self = this;

        let error;
        let category;

        try {
            let remoteData = self.param('category');
            if (!remoteData) {
                throw new ApiError('No json body was given', 400);
            }

            // check if there already exists a category with the same name
            category = await self.db.sequelize.transaction(async (t) => {
                let sameName = await self.db.Category.findOne({
                    where: {
                        name: remoteData.name,
                    },
                    lock: true,
                    transaction: t,
                });
                //If the category already exists then throw an error
                if (sameName) {
                    throw new ApiError(
                        'There is already a category with the same name',
                        400
                    );
                }

                let newCategory = self.db.Category.build();
                //Create the new Category and write it to the database
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

    //Delete a category with the given id
    async actionDelete() {
        const self = this;

        let error = null;
        let category = null;

        //Delete the category from the database
        try {
            let categoryId = self.param('id');
            if (!categoryId) {
                throw new ApiError('No id was given', 400);
            }

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
            //If no category was found with this id throw an error
            if (!category) {
                throw new ApiError('Found no category with given id', 404);
            }
        } catch (err) {
            error = err;
        }

        //Render either the error or 204 No-Content
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
