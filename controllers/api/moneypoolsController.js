const Controller = require('../mainController.js');
const ApiError = require('../../core/error.js');
require('dotenv').config();

class ApiMoneypoolsController extends Controller {
    constructor(...args) {
        super(...args);
        const self = this;

        self.format = Controller.HTTP_FORMAT_JSON;

        self.before(['*'], async function (next) {
            let householdUser;
            if (self.req.authorized === true && self.param('hid')) {
                householdUser = await self.db.HouseholdUser.findOne({
                    where: {
                        userId: self.req.user.id,
                        householdId: self.param('hid'),
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
    }

    // GET all moneypools for the selected household
    async actionGet() {
        const self = this;

        let moneypools;
        let error = null;
        try {
            let where = { householdId: self.param('hid') };

            if (self.param('id')) {
                where['id'] = self.param('id');
            }

            moneypools = await self.db.Moneypool.findAll({
                include: self.db.Moneypool.extendInclude,
                where: where,
            });

            if (moneypools.length < 1) {
                throw new ApiError('No moneypools found.', 404);
            }
        } catch (err) {
            error = err;
        }

        if (error) {
            self.handleError(error);
        } else {
            self.render(
                {
                    moneypools: moneypools,
                },
                {
                    statusCode: 200,
                }
            );
        }
    }
}
module.exports = ApiMoneypoolsController;
