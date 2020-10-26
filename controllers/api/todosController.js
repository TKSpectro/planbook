const Controller = require('../mainController.js');
const ApiError = require('../../core/error.js');

class ApiTodosController extends Controller {
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

        let todos = [];
        let error = null;

        try {
            todos = await self.db.Todo.findAll({
                include: self.db.Todo.extendInclude,
                where: {
                    householdId: self.req.user.householdId,
                },
            });
            if (!todos) {
                throw new ApiError('No todos found', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render(
                {
                    todos: todos,
                },
                {
                    statusCode: 200,
                }
            );
        }
    }

    async actionGetOne() {
        const self = this;

        let todoId = self.param('id');
        let todo = null;
        let error = null;

        try {
            todo = await self.db.Todo.findOne({
                where: {
                    id: todoId,
                    householdId: self.req.user.householdId,
                },
                include: self.db.Todo.extendInclude,
            });
            if (!todo) {
                throw new ApiError('No todo found with this id', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render({
                todo: todo,
            });
        }
    }

    async actionCreate() {
        const self = this;

        let remoteData = self.param('todo');
        remoteData.householdId = self.req.user.householdId;
        let todo = null;
        let error = null;

        try {
            todo = await self.db.sequelize.transaction(async (t) => {
                let newTodo = self.db.Todo.build();

                newTodo.writeRemotes(remoteData);
                await newTodo.save({
                    transaction: t,
                    lock: true,
                    include: self.db.Todo.extendInclude,
                });

                return newTodo;
            });
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render(
                {
                    todo: todo,
                },
                {
                    statusCode: 201,
                }
            );
        }
    }

    async actionUpdate() {
        const self = this;

        let remoteData = self.param('todo');
        let todoId = self.param('id');

        let todo = null;
        let error = null;

        //get the old todo
        try {
            todo = await self.db.sequelize.transaction(async (t) => {
                let updateTodo = await self.db.Todo.findOne(
                    {
                        where: {
                            id: todoId,
                            householdId: self.req.user.householdId,
                        },
                    },
                    { transaction: t }
                );
                if (updateTodo) {
                    await updateTodo.update(
                        {
                            updatedAt: new Date(),
                            task: remoteData.income,
                            value: remoteData.value,
                            done: remoteData.done,
                        },
                        {
                            where: {
                                id: todoId,
                            },
                        },
                        { transaction: t, lock: true }
                    );
                }

                return updateTodo;
            });
            if (!remoteData) {
                throw new ApiError('no todo object in body found', 400);
            }
            if (!todo) {
                throw new ApiError('Todo could not be updated', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render(
                {
                    todo: todo,
                },
                {
                    statusCode: 202,
                }
            );
        }
    }

    async actionDelete() {
        const self = this;

        let todoId = self.param('id');
        let todo = null;
        let error = null;

        // delete the category
        try {
            todo = await self.db.sequelize.transaction(async (t) => {
                todo = await self.db.Todo.destroy(
                    {
                        where: {
                            id: todoId,
                            householdId: self.req.user.householdId,
                        },
                    },
                    { transaction: t, lock: true }
                );

                return todo;
            });
            // if no category was found with this id throw an error
            if (!todo) {
                throw new ApiError('Found no todo for given id', 404);
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

module.exports = ApiTodosController;
