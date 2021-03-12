/**
 * @api {get} /cron/bookRecurringPayments
 *
 * @apiDescription Books all recurring payments which were today. This route should only be called by the server itself.
 *
 * @apiName BookRecurringPayments
 * @apiGroup Cron
 *
 * @apiParam {String} cron_password A random generated password which is written in a config file. So only the server can actually use this route
 *
 * @apiSuccess {Object[]} payments  Array of all written payments.
 *
 * @apiSuccess {Object} payments.payment    One payment from the array.
 *
 * @apiSuccess {Number}   payments.payment.id   Unique id.
 * @apiSuccess {Number}   payments.payment.value    Amount paid.
 * @apiSuccess {String}   payments.payment.purpose  Description of the payment.
 * @apiSuccess {Number}   payments.payment.householdId  Household in which the payment was booked.
 * @apiSuccess {Number}   payments.payment.categoryId  Category of the payment.
 * @apiSuccess {Number}   payments.payment.recurringPaymentId  Id of the corresponding recurring payment.
 * @apiSuccess {Date}     payments.payment.createdAt   Date of creation.
 * @apiSuccess {Date}     payments.payment.updatedAt   Date of last update.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "writtenPayments": [
 *     {
 *       "id": 20,
 *       "value": -10,
 *       "purpose": "bought some donuts",
 *       "householdId": 1,
 *       "categoryId": 1,
 *       "recurringPaymentId": 1,
 *       "updatedAt": "2021-03-12T15:02:49.584Z",
 *       "createdAt": "2021-03-12T15:02:49.584Z"
 *     }
 *   ]
 * }
 *
 * @apiError 401:Unauthorized send cron_password was wrong.
 */
