/**
 * @api {get} /payments Get Payments
 * @apiDescription Returns all payments for the given householdId.
 * @apiName GetPayments
 * @apiGroup Payment
 *
 * @apiParam {Number} hid id of the household to get the moneypools for.
 * @apiParam {Number} [id]                    Id of the payment
 *
 * @apiParam {Date} [start] minimum start date.
 * @apiParam {Date} [end] maximum end date.
 * @apiParam {Number} [limit] limit number of payments.
 *
 * @apiSuccess {Object[]} payments Array of payments.
 * @apiSuccess {Object}   payments.payment One payment
 * @apiSuccess {Number}   payments.payment.id Unique id.
 * @apiSuccess {String}   payments.payment.value Value of the payment.
 * @apiSuccess {String}   payments.payment.purpose Purpose of the payment.
 * @apiSuccess {Number}   payments.payment.moneypoolId Id of a moneypool if its a moneypool-payment.
 * @apiSuccess {Number}   payments.payment.householdId Id of the household in which the payment was booked.
 * @apiSuccess {Number}   payments.payment.categoryId Id of the category.
 * @apiSuccess {Number}   payments.payment.recurringPaymentId Id of a recurringPayment if the payment was booked from a recurring one.
 * @apiSuccess {Date}     payments.payment.createdAt Date of creation.
 * @apiSuccess {Date}     payments.payment.updatedAt Date of last update.
 * @apiSuccess {Object}   payments.payment.household More information about the household.
 * @apiSuccess {Object}   payments.payment.category More information category.
 * @apiSuccess {Object}   payments.payment.recurringPayment More information about the recurring payment.
 * @apiSuccess {Object}   payments.payment.moneypool More information about the moneypool.
 * @apiSuccess {Object}   payments.payment.user More information about the user.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "payments": [
 *     {
 *       "id": 13,
 *       "value": -20,
 *       "purpose": "test payment",
 *       "createdAt": "2021-03-13T11:00:00.000Z",
 *       "updatedAt": "2021-03-13T11:00:00.000Z",
 *       "moneypoolId": null,
 *       "householdId": 1,
 *       "categoryId": 2,
 *       "recurringPaymentId": null,
 *       "userId": null,
 *       "household": {
 *         "id": 1,
 *         "name": "Käppis"
 *       },
 *       "category": {
 *         "id": 2,
 *         "name": "Entertainment"
 *       },
 *       "recurringPayment": null,
 *       "moneypool": null,
 *       "user": null
 *     }
 *   ]
 * }
 * @apiError 401:Unauthorized Not logged in.
 * @apiError 404:NotFound No categories were found.
 */

/**
 * @api {post} /payments Create payment
 * @apiDescription Creates a new payment
 * @apiName PostPayment
 * @apiGroup Payment
 *
 * @apiParam {Number} hid                     Id of the household
 *
 * @apiParam {Object} payment
 * @apiParam {Bool} payment.income Is it a income or expense.
 * @apiParam {Number} payment.value Value of the payment.
 * @apiParam {String} payment.purpose Purpose of the payment.
 * @apiParam {Number} payment.categoryId CategoryId to which the payment is set.
 *
 * @apiSuccess {Object} payment One payment.
 * @apiSuccess {Number} payment.id Unique id.
 * @apiSuccess {Number} payment.value Value of the payment.
 * @apiSuccess {String} payment.purpose Purpose of the payment.
 * @apiSuccess {Number} payment.householdId HouseholdId to which the payment was booked.
 * @apiSuccess {Number} payment.categoryId Id of the category.
 * @apiSuccess {Date}   payment.createdAt Date of creation.
 * @apiSuccess {Date}   payment.updatedAt Date of last update.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 OK
 * {
 *   "payment": {
 *     "id": 20,
 *     "value": 20,
 *     "purpose": "some test payment",
 *     "householdId": "1",
 *     "categoryId": 1,
 *     "updatedAt": "2021-03-15T09:23:27.719Z",
 *     "createdAt": "2021-03-15T09:23:27.719Z"
 *   }
 * }
 *
 * @apiError 400:BadRequest No or wrong json.
 * @apiError 401:Unauthorized Not logged in.
 * @apiError 404:NotFound No categories were found.
 */
