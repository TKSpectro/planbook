/**
 * @api {get} /moneypools Get Moneypools
 * @apiDescription Returns all moneypools for the given householdId. If an id is given it will return the one moneypool with more includes.
 * @apiName GetMoneypools
 * @apiGroup Moneypool
 *
 * @apiParam {Number} hid  id of the household to get the moneypools for.
 * @apiParam {Number} [id] optional id of the moneypool for more information.
 *
 * @apiSuccess {Object[]} moneypools             Array of moneypools.
 *
 * @apiSuccess {Object} moneypools.moneypool                One moneypool
 *
 * @apiSuccess {Number}   moneypools.moneypool.id                 Unique id.
 * @apiSuccess {String}   moneypools.moneypool.name               Name of the moneypool.
 * @apiSuccess {String}   moneypools.moneypool.description        Description of the moneypool.
 * @apiSuccess {Number}   moneypools.moneypool.totalNeededMoney   The money needed to complete the moneypool.
 * @apiSuccess {Number}   moneypools.moneypool.householdId        Id of the household which the person was invited to.
 * @apiSuccess {Date}     moneypools.moneypool.createdAt          Date of creation.
 * @apiSuccess {Date}     moneypools.moneypool.updatedAt          Date of last update.
 * @apiSuccess {Object}   moneypools.moneypool.moneypool          More information about the household.
 * @apiSuccess {Object}   moneypools.moneypool.members        More information about the members (Optional - only if id is given).
 * @apiSuccess {Object}   moneypools.moneypool.payments        More information about the payments (Optional - only if id is given).
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "moneypools": [
 *     {
 *       "id": 1,
 *       "name": "Japan vacation",
 *       "description": "My Description",
 *       "totalNeededMoney": 4000,
 *       "householdId": 1,
 *       "createdAt": "2021-03-14T13:07:39.000Z",
 *       "updatedAt": "2021-03-14T13:07:39.000Z",
 *       "household": {
 *         "id": 1,
 *         "name": "Household",
 *         "ownerId": 1,
 *         "createdAt": "2021-03-14T13:07:39.000Z",
 *         "updatedAt": "2021-03-14T13:07:39.000Z"
 *       }
 *     },
 *     {
 *       "id": 2,
 *       "name": "vacation 2",
 *       "description": "vacation to USA",
 *       "totalNeededMoney": 5000,
 *       "householdId": 1,
 *       "createdAt": "2021-03-14T13:07:39.000Z",
 *       "updatedAt": "2021-03-14T13:07:39.000Z",
 *       "household": {
 *         "id": 1,
 *         "name": "Household",
 *         "ownerId": 1,
 *         "createdAt": "2021-03-14T13:07:39.000Z",
 *         "updatedAt": "2021-03-14T13:07:39.000Z"
 *       }
 *     }
 *   ]
 * }
 * @apiError 401:Unauthorized Not logged in.
 * @apiError 404:NotFound No categories were found.
 */

/**
 * @api {post} /moneypools Create moneypool
 * @apiDescription Creates a new moneypool
 * @apiName PostMoneypool
 * @apiGroup Moneypool
 *
 * @apiParam {Number} hid                     Id of the household
 *
 * @apiParam {Object} moneypool
 * @apiParam {String} moneypool.name Name of the new household.
 * @apiParam {String} moneypool.description Description for the new household.
 * @apiParam {Number} moneypool.totalNeededMoney Needed money to complete the moneypool.
 *
 * @apiSuccess {Object} moneypool One moneypool.
 * @apiSuccess {Number} moneypool.id Unique id.
 * @apiSuccess {String} moneypool.name Name of the new household.
 * @apiSuccess {String} moneypool.description Description for the new household.
 * @apiSuccess {Number} moneypool.totalNeededMoney Needed money to complete the moneypool.
 * @apiSuccess {Number} moneypool.householdId Id of the household.
 * @apiSuccess {Date} moneypool.createdAt Date of creation.
 * @apiSuccess {Date} moneypool.updatedAt Date of last update.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 OK
 * {
 *   "moneypool": {
 *     "id": 3,
 *     "name": "Japan vacation",
 *     "description": "vulputate",
 *     "totalNeededMoney": 4000,
 *     "householdId": "1",
 *     "updatedAt": "2021-03-15T08:58:10.702Z",
 *     "createdAt": "2021-03-15T08:58:10.702Z"
 *   }
 * }
 *
 * @apiError 400:BadRequest No or wrong json.
 * @apiError 401:Unauthorized Not logged in.
 * @apiError 404:NotFound No categories were found.
 */

/**
 * @api {put} /moneypool Update moneypool
 * @apiDescription Updates a moneypool with the specified values
 * @apiName PutMoneypool
 * @apiGroup Moneypool
 *
 * @apiParam {Number} hid Id of the household
 * @apiParam {Number} id Id of the moneypool
 *
 * @apiParam {Object} moneypool
 * @apiParam {String} moneypool.name Name of the new household.
 * @apiParam {String} moneypool.description Description for the new household.
 * @apiParam {Number} moneypool.totalNeededMoney Needed money to complete the moneypool.
 *
 * @apiSuccess {Object} moneypool One moneypool.
 * @apiSuccess {Number} moneypool.id Unique id.
 * @apiSuccess {String} moneypool.name Name of the new household.
 * @apiSuccess {String} moneypool.description Description for the new household.
 * @apiSuccess {Number} moneypool.totalNeededMoney Needed money to complete the moneypool.
 * @apiSuccess {Number} moneypool.householdId Id of the household.
 * @apiSuccess {Date} moneypool.createdAt Date of creation.
 * @apiSuccess {Date} moneypool.updatedAt Date of last update.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 202 Accepted
 * {
 *   "moneypool": {
 *     "id": 3,
 *     "name": "Japan vacation",
 *     "description": "vulputate",
 *     "totalNeededMoney": 4000,
 *     "householdId": "1",
 *     "updatedAt": "2021-03-15T08:58:10.702Z",
 *     "createdAt": "2021-03-15T08:58:10.702Z"
 *   }
 * }
 *
 * @apiError 400:BadRequest No or wrong json body.
 * @apiError 401:Unauthorized Not logged in.
 * @apiError 404:NotFound No household was found.
 */
