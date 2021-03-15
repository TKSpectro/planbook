/**
 * @api {get} /householdsUsers Get HouseholdsUsers
 * @apiDescription Returns all HouseholdsUsers in which the requester is present
 * @apiName GetHouseholdsUsers
 * @apiGroup HouseholdsUsers
 *
 * @apiParam {String} [hid]  Optional household id. If given gets the specified household with more info included.
 *
 * @apiSuccess {Object[]} households             Array of householdUsers.
 *
 * @apiSuccess {Number} households.userId                  Id of the user.
 * @apiSuccess {Number} households.householdId             Id of the household.
 *
 * @apiSuccess {Object}   households.household             Corresponding households values
 * @apiSuccess {Number}   households.household.id          Unique id.
 * @apiSuccess {String}   households.household.name        household name.
 * @apiSuccess {Number}   households.household.ownerId     Id of the owner.
 * @apiSuccess {Date}     households.household.createdAt   Date of creation.
 * @apiSuccess {Date}     households.household.updatedAt   Date of last update.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "households": [
 *     {
 *       "userId": 1,
 *       "householdId": 1,
 *       "household": {
 *         "id": 1,
 *         "name": "Household",
 *         "ownerId": 1,
 *         "createdAt": "2021-03-14T13:07:39.000Z",
 *         "updatedAt": "2021-03-14T13:07:39.000Z"
 *       }
 *     },
 *     {
 *       "userId": 1,
 *       "householdId": 5,
 *       "household": {
 *         "id": 5,
 *         "name": "APIHome",
 *         "ownerId": 1,
 *         "createdAt": "2021-03-14T17:41:39.000Z",
 *         "updatedAt": "2021-03-14T17:41:39.000Z"
 *       }
 *     }
 *   ]
 * }
 * @apiError 401:Unauthorized Not logged in.
 * @apiError 404:NotFound No categories were found.
 */

/**
 * @api {post} /householdsUsers Create householdUser
 * @apiDescription Creates a new household-user connection. This route can just be used by the householdOwner. Everybody else must be invited.
 * @apiName PostHouseholdsUsers
 * @apiGroup HouseholdsUsers
 *
 * @apiParam {Object} householdUser                 householdUser object
 * @apiParam {Number} householdUser.householdId     id of the household
 *
 * @apiSuccess {Object}   householdUser         The created householdUser
 *
 * @apiSuccess {Number}   householdUser.id          Unique id.
 * @apiSuccess {Date}     householdUser.timeJoined  Date of joining the household
 * @apiSuccess {Number}   householdUser.householdId household id.
 * @apiSuccess {Number}   householdUser.userId      user id.
 * @apiSuccess {Date}     householdUser.createdAt   Date of creation.
 * @apiSuccess {Date}     householdUser.updatedAt   Date of last update.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 OK
 * {
 *   "householdUser": {
 *     "id": 7,
 *     "timeJoined": "2021-03-14T17:41:43.830Z",
 *     "householdId": 5,
 *     "userId": 1,
 *     "updatedAt": "2021-03-14T17:41:43.830Z",
 *     "createdAt": "2021-03-14T17:41:43.830Z"
 *   }
 * }
 *
 * @apiError 400:BadRequest No or wrong json.
 * @apiError 401:Unauthorized Not logged in.
 * @apiError 404:NotFound No categories were found.
 */

/**
 * @api {delete} /householdsUsers Delete householdUser
 * @apiDescription Deletes the household-user connection with the specified ids
 * @apiName DeleteHouseholdsUser
 * @apiGroup HouseholdsUsers
 *
 * @apiParam {Number}   hid                     Id of the householdId to delete.
 * @apiParam {Number}   id                      Id of the userId to delete.
 *
 * @apiSuccess 204 No-Content
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 204 No Content
 *
 * @apiError 400:BadRequest No hid given, No id given or not the owner.
 * @apiError 401:Unauthorized Not logged in.
 * @apiError 404:NotFound No household was found or not the owner of the household.
 */
