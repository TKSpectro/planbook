/**
 * @api {get} /recurringPayments Get RecurringPayment
 * @apiDescription Returns all recurringPayments for the given recurringPaymentId.
 * @apiName GetRecurringPayments
 * @apiGroup RecurringPayment
 *
 * @apiParam {Number} hid id of the recurringPayment to get the recurringPayments for.
 * @apiParam {Number} [id]                    Id of the recurringPayment
 *
 * @apiParam {Date} [start] minimum start date.
 * @apiParam {Number} [limit] limit number of recurringPayments.
 *
 * @apiSuccess {Object[]} recurringPayments Array of recurringPayments.
 * @apiSuccess {Object}   recurringPayments.recurringPayment One recurringPayment
 * @apiSuccess {Number}   recurringPayments.recurringPayment.id Unique id.
 * @apiSuccess {Date}     recurringPayments.recurringPayment.startDate Date of when the payments get started to be booked.
 * @apiSuccess {Date}     recurringPayments.recurringPayment.endDate Date of when the payments get stopped to be booked.
 * @apiSuccess {String}   recurringPayments.recurringPayment.value Value of the recurringPayment.
 * @apiSuccess {String}   recurringPayments.recurringPayment.purpose Purpose of the recurringPayment.
 * @apiSuccess {String}   recurringPayments.recurringPayment.interval Interval in which it gets booked.
 * @apiSuccess {Number}   recurringPayments.recurringPayment.recurringPaymentId Id of the recurringPayment in which the recurringPayment was booked.
 * @apiSuccess {Number}   recurringPayments.recurringPayment.categoryId Id of the category.
 * @apiSuccess {Date}     recurringPayments.recurringPayment.createdAt Date of creation.
 * @apiSuccess {Date}     recurringPayments.recurringPayment.updatedAt Date of last update.
 * @apiSuccess {Object}   recurringPayments.recurringPayment.recurringPayment More information about the recurringPayment.
 * @apiSuccess {Object}   recurringPayments.recurringPayment.category More information category.
 *
 * @apiSuccessExample Success-Response:
 * {
 *   "recurringPayments": [
 *     {
 *       "id": 2,
 *       "startDate": "2020-09-30T22:00:00.000Z",
 *       "endDate": null,
 *       "value": -350,
 *       "purpose": "rental",
 *       "interval": "monthly",
 *       "createdAt": "2021-03-14T13:07:39.000Z",
 *       "updatedAt": "2021-03-14T13:07:39.000Z",
 *       "recurringPaymentId": 1,
 *       "categoryId": 2,
 *       "recurringPayment": {
 *         "id": 1,
 *         "name": "recurringPayment"
 *       },
 *       "category": {
 *         "id": 2,
 *         "name": "Entertainment"
 *       }
 *     }
 *   ]
 * }
 * @apiError 401:Unauthorized Not logged in.
 * @apiError 404:NotFound No categories were found.
 */

/**
 * @api {post} /recurringPayments Create recurringPayment
 * @apiDescription Creates a new recurringPayment
 * @apiName PostRecurringPayment
 * @apiGroup RecurringPayment
 *
 * @apiParam {Number} hid                     Id of the recurringPayment
 *
 * @apiParam {Object} recurringPayment
 * @apiParam {Date} recurringPayment.startDate Date of when the payments get started to be booked.
 * @apiParam {Date} recurringPayment.endDate Date of when the payments get stopped to be booked.
 * @apiParam {Number} recurringPayment.value Value of the recurringPayment.
 * @apiParam {String} recurringPayment.purpose Purpose of the recurringPayment.
 * @apiParam {String} recurringPayment.interval Interval of the payment.
 * @apiParam {Number} recurringPayment.categoryId CategoryId to which the recurringPayment is set.
 *
 * @apiSuccess {Object}   recurringPayment
 * @apiSuccess {Number}   recurringPayment.id Unique id.
 * @apiSuccess {Date}     recurringPayment.startDate Date of when the payments get started to be booked.
 * @apiSuccess {Date}     recurringPayment.endDate Date of when the payments get stopped to be booked.
 * @apiSuccess {String}   recurringPayment.value Value of the recurringPayment.
 * @apiSuccess {String}   recurringPayment.purpose Purpose of the recurringPayment.
 * @apiSuccess {String}   recurringPayment.interval Interval in which it gets booked.
 * @apiSuccess {Number}   recurringPayment.recurringPaymentId Id of the recurringPayment in which the recurringPayment was booked.
 * @apiSuccess {Number}   recurringPayment.categoryId Id of the category.
 * @apiSuccess {Date}     recurringPayment.createdAt Date of creation.
 * @apiSuccess {Date}     recurringPayment.updatedAt Date of last update.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 OK
 * {
 *   "recurringPayment": {
 *     "id": 22,
 *     "startDate": "2020-09-30T22:00:00.000Z",
 *     "endDate": null,
 *     "value": -10,
 *     "purpose": "bought some donuts",
 *     "interval": "daily",
 *     "recurringPaymentId": "1",
 *     "categoryId": 1,
 *     "updatedAt": "2021-03-03T11:57:45.929Z",
 *     "createdAt": "2021-03-03T11:57:45.929Z"
 *   }
 * }
 *
 * @apiError 400:BadRequest No or wrong json.
 * @apiError 401:Unauthorized Not logged in.
 * @apiError 404:NotFound No categories were found.
 */

/**
 * @api {put} /recurringPayment Update recurringPayment
 * @apiDescription Updates a recurringPayment with the specified values
 * @apiName PutRecurringPayment
 * @apiGroup RecurringPayment
 *
 * @apiParam {Number} hid Id of the recurringPayment
 * @apiParam {Number} id Id of the recurringPayment
 *
 * @apiParam {Object} recurringPayment
 * @apiParam {Date} recurringPayment.startDate Date of when the payments get started to be booked.
 * @apiParam {Date} recurringPayment.endDate Date of when the payments get stopped to be booked.
 * @apiParam {Number} recurringPayment.value Value of the recurringPayment.
 * @apiParam {String} recurringPayment.purpose Purpose of the recurringPayment.
 * @apiParam {String} recurringPayment.interval Interval of the payment.
 * @apiParam {Number} recurringPayment.categoryId CategoryId to which the recurringPayment is set.
 *
 * @apiSuccess {Object}   recurringPayment
 * @apiSuccess {Number}   recurringPayment.id Unique id.
 * @apiSuccess {Date}     recurringPayment.startDate Date of when the payments get started to be booked.
 * @apiSuccess {Date}     recurringPayment.endDate Date of when the payments get stopped to be booked.
 * @apiSuccess {String}   recurringPayment.value Value of the recurringPayment.
 * @apiSuccess {String}   recurringPayment.purpose Purpose of the recurringPayment.
 * @apiSuccess {String}   recurringPayment.interval Interval in which it gets booked.
 * @apiSuccess {Number}   recurringPayment.recurringPaymentId Id of the recurringPayment in which the recurringPayment was booked.
 * @apiSuccess {Number}   recurringPayment.categoryId Id of the category.
 * @apiSuccess {Date}     recurringPayment.createdAt Date of creation.
 * @apiSuccess {Date}     recurringPayment.updatedAt Date of last update.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 202 Accepted
 * {
 *   "recurringPayment": {
 *     "id": 1,
 *     "startDate": "2020-09-30T22:00:00.000Z",
 *     "endDate": null,
 *     "value": -10,
 *     "purpose": "updated2 bought some donuts",
 *     "interval": "daily",
 *     "createdAt": "2021-03-02T15:25:09.000Z",
 *     "updatedAt": "2021-03-03T11:58:04.794Z",
 *     "recurringPaymentId": 1,
 *     "categoryId": 1
 *   }
 * }
 *
 * @apiError 400:BadRequest No or wrong json body.
 * @apiError 401:Unauthorized Not logged in.
 * @apiError 404:NotFound No recurringPayment was found.
 */

/**
 * @api {delete} /recurringPayments Delete recurringPayment
 * @apiDescription Deletes the recurringPayment with the specified id
 * @apiName DeleteRecurringPayment
 * @apiGroup recurringPayment
 *
 * @apiParam {Number}   hid Id of the household.
 * @apiParam {Number}   id Id of the recurringPayment.
 *
 * @apiSuccess 204 No-Content
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 204 No Content
 *
 * @apiError 400:BadRequest No hid given.
 * @apiError 401:Unauthorized Not logged in.
 * @apiError 404:NotFound No recurringPayment was found.
 */
