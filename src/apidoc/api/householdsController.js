/**
 * @api {post} /households Create household
 * @apiDescription Creates a new household with the specified parameters
 * @apiName PostHousehold
 * @apiGroup Household
 *
 * @apiParam {String} name  name of the household.
 *
 * @apiSuccess {Object}   household            The created household
 *
 * @apiSuccess {Number}   household.id          Unique id.
 * @apiSuccess {String}   household.name        household name.
 * @apiSuccess {Number}   household.ownerId     Id of the owner.
 * @apiSuccess {Date}     household.createdAt   Date of creation.
 * @apiSuccess {Date}     household.updatedAt   Date of last update.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 OK
 * {
 *   "household": {
 *     "id": 6,
 *     "name": "APIHome",
 *     "ownerId": 1,
 *     "updatedAt": "2021-03-12T16:25:37.696Z",
 *     "createdAt": "2021-03-12T16:25:37.696Z"
 *   }
 * }
 *
 * @apiError 400:BadRequest No or wrong json.
 * @apiError 401:Unauthorized Not logged in.
 * @apiError 404:NotFound No categories were found.
 */

/**
 * @api {put} /households Update household
 * @apiDescription Updates a household with the specified values
 * @apiName PutHousehold
 * @apiGroup Household
 *
 * @apiParam {Object}   household           Household object.
 * @apiParam {Number}   household.id        Id of the household to change.
 * @apiParam {String}   household.name      New name of the household.
 * @apiParam {Number}   household.ownerId   New ownerId of the household
 *
 * @apiSuccess {Object}   household            The created household
 *
 * @apiSuccess {Number}   household.id          Unique id.
 * @apiSuccess {String}   household.name        household name.
 * @apiSuccess {Number}   household.ownerId     Id of the owner.
 * @apiSuccess {Date}     household.createdAt   Date of creation.
 * @apiSuccess {Date}     household.updatedAt   Date of last update.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 202 Accepted
 * {
 *   "household": {
 *     "id": 6,
 *     "name": "PostMan2Home",
 *     "ownerId": 1,
 *     "createdAt": "2021-03-12T16:25:37.000Z",
 *     "updatedAt": "2021-03-12T16:38:50.749Z"
 *   }
 * }
 *
 * @apiError 400:BadRequest No or wrong json body.
 * @apiError 401:Unauthorized Not logged in.
 * @apiError 404:NotFound No household was found.
 */

/**
 * @api {delete} /households Delete household
 * @apiDescription Deletes the household with the specified id
 * @apiName DeleteHousehold
 * @apiGroup Household
 *
 * @apiParam {Number}   hid                     Id of the household to delete.
 *
 * @apiSuccess 204 No-Content
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 204 No Content
 *
 * @apiError 400:BadRequest No hid given.
 * @apiError 401:Unauthorized Not logged in.
 * @apiError 404:NotFound No household was found or not the owner of the household.
 */
