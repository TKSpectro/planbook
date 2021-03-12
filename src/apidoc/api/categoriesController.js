/**
 * @api {get} /categories Get categories
 * @apiDescription Returns all users or one if id is specified
 * @apiName GetCategories
 * @apiGroup Category
 *
 * @apiParam {String} [id]  Optional category id. If given gets one category.
 *
 * @apiSuccess {Object[]} categories             Array of categories.
 *
 * @apiSuccess {Object} categories.category             One category from the array.
 *
 * @apiSuccess {Number}   categories.category.id          Unique id.
 * @apiSuccess {String}   categories.category.name        Category name.
 * @apiSuccess {Date}     categories.category.createdAt   Date of creation.
 * @apiSuccess {Date}     categories.category.updatedAt   Date of last update.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "categories": [
 *     {
 *       "id": 1,
 *       "name": "Food",
 *       "createdAt": "2021-03-12T11:36:53.000Z",
 *       "updatedAt": "2021-03-12T11:36:53.000Z"
 *     },
 *     {
 *       "id": 2,
 *       "name": "Entertainment",
 *       "createdAt": "2021-03-12T11:36:53.000Z",
 *       "updatedAt": "2021-03-12T11:36:53.000Z"
 *     },
 *     {
 *       "id": 3,
 *       "name": "Gifts",
 *       "createdAt": "2021-03-12T11:36:53.000Z",
 *       "updatedAt": "2021-03-12T11:36:53.000Z"
 *     },
 *     {
 *       "id": 4,
 *       "name": "Income",
 *       "createdAt": "2021-03-12T11:36:53.000Z",
 *       "updatedAt": "2021-03-12T11:36:53.000Z"
 *     }
 *   ]
 * }
 * @apiError 401:Unauthorized Not logged in.
 * @apiError 404:NotFound No categories were found.
 */

/**
 * @api {post} /categories Create category
 * @apiDescription Creates a new category with the specified name
 * @apiName PostCategory
 * @apiGroup Category
 *
 * @apiParam {String} name  category name.
 *
 * @apiSuccess {Object} category               The created category.
 *
 * @apiSuccess {Number}   category.id          Unique id.
 * @apiSuccess {String}   category.name        Category name.
 * @apiSuccess {Date}     category.createdAt   Date of creation.
 * @apiSuccess {Date}     category.updatedAt   Date of last update.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "category": {
 *     "id": 1,
 *     "name": "New Category",
 *     "updatedAt": "2021-03-12T14:47:50.746Z",
 *     "createdAt": "2021-03-12T14:47:50.746Z"
 *   }
 * }
 * @apiError 400:NoBody No or wrong json body was send.
 * @apiError 404:NotFound No categories were found.
 */

/**
 * @api {delete} /categories Delete category
 * @apiDescription Deletes the category with the specified id
 * @apiName DeleteCategory
 * @apiGroup Category
 *
 * @apiParam {String} id  Category id.
 *
 * @apiSuccess 204 No-Content
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 204 No Content
 *
 * @apiError 400:BadRequest No id given.
 * @apiError 401:Unauthorized Not logged in.
 * @apiError 404:NotFound No category found to delete.
 */
