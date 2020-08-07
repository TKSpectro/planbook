const Controller = require('../core/controller.js');
const Passport = require('../core/passport.js');
const ApiError = require('../core/error.js');

class MainController extends Controller {
    constructor(...args) {
        super(...args);

        const self = this;

        // css / js
        self.jsFiles = [];
        self.cssFiles = [];

        // set default unauthorized
        self.req.authorized = false;
        self.req.user = null;

        self.before(['*'], async (next) => {
            let tokenPayload = Passport.isAuthorized(self.req);
            if (tokenPayload !== false) {
                self.db.User.findOne({
                    where: {
                        id: tokenPayload.id,
                    },
                })
                    .then(function (user) {
                        if (user) {
                            self.req.user = user;
                            self.req.authorized = true;
                        }
                        next();
                    })
                    .catch(function (err) {
                        console.log(err);
                        next();
                    });
            } else {
                next();
            }
        });
    }

    paging(limit = 25, page = 1) {
        const self = this;
        let paging = {
            limit: self.param('limit') || limit,
            page: self.param('page') || page,
            offset: self.param('offset') || null,
        };

        //convert to numbers because these are string
        paging.limit = Number(paging.limit);
        paging.page = Number(paging.page);

        if (paging.offset === null) {
            paging.offset = paging.limit * (paging.page - 1);
        } else {
            paging.offset = Number(paging.offset);
        }
        return paging;
    }

    meta(paging, total) {
        return {
            page: paging.page,
            limit: paging.limit,
            total: total,
            offset: paging.offset,
            previous: paging.page > 1 ? paging.page - 1 : -1,
            next: total - paging.page * paging.limit > 0 ? paging.page + 1 : -1,
        };
    }

    handleError(error) {
        const self = this;

        if (error instanceof ApiError) {
            self.render(
                {
                    details: error.message,
                },
                {
                    statusCode: error.statusCode,
                }
            );
        } else {
            self.render(
                {
                    details: error.message,
                },
                {
                    statusCode: 500,
                }
            );
        }
    }

    js(file) {
        this.jsFiles.push(file);
    }

    css(file) {
        this.cssFiles.push(file);
    }
}

module.exports = MainController;
