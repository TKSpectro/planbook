/**
 * @api {get} /invites Get Invites
 * @apiDescription Returns all invites for the given householdId.
 * @apiName GetInvites
 * @apiGroup Invite
 *
 * @apiParam {Number} hid  id of the household to get the invites for
 *
 * @apiSuccess {Object[]} invites             Array of invites.
 *
 * @apiSuccess {Object} invites.invite                One invite
 *
 * @apiSuccess {Number}   invites.invite.id                 Unique id.
 * @apiSuccess {Date}     invites.invite.validUntil         Date till the invite is usable.
 * @apiSuccess {Bool}     invites.invite.wasUsed            Was the invite already used.
 * @apiSuccess {String}   invites.invite.invitedEmail       Email of the invited person.
 * @apiSuccess {String}   invites.invite.link               Generated link which the person can use.
 * @apiSuccess {Number}   invites.invite.senderId           Id of the person who send the invite.
 * @apiSuccess {Number}   invites.invite.householdId        Id of the household which the person was invited to.
 * @apiSuccess {Date}     invites.invite.createdAt          Date of creation.
 * @apiSuccess {Date}     invites.invite.updatedAt          Date of last update.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "invites": [
 *     {
 *       "id": 1,
 *       "validUntil": "2021-03-21T17:58:36.000Z",
 *       "wasUsed": false,
 *       "invitedEmail": "tomkaeppler@web.de",
 *       "link": "c27bc350-daca-4218-a2ae-90dc2be172ce",
 *       "senderId": 1,
 *       "householdId": 1,
 *       "createdAt": "2021-03-14T17:58:36.000Z",
 *       "updatedAt": "2021-03-14T17:58:36.000Z",
 *       "sender": {
 *         "id": 1,
 *         "firstName": "Tom",
 *         "lastName": "Käppler",
 *         "email": "tom@mail.com"
 *       },
 *       "household": {
 *         "id": 1,
 *         "name": "Käppis",
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
 * @api {post} /invites Create invite
 * @apiDescription Creates a new invite
 * @apiName PostInvite
 * @apiGroup Invite
 *
 * @apiParam {Number} hid                     Id of the household
 * @apiParam {Object} invite                  Invite object
 * @apiParam {String} invite.invitedEmail     Id of the household
 *
 * @apiSuccess {Object}   invite                One invite.
 *
 * @apiSuccess {Number}   invite.id                 Unique id.
 * @apiSuccess {Date}     invite.validUntil         Date till the invite is usable.
 * @apiSuccess {Bool}     invite.wasUsed            Was the invite already used.
 * @apiSuccess {String}   invite.invitedEmail       Email of the invited person.
 * @apiSuccess {String}   invite.link               Generated link which the person can use.
 * @apiSuccess {Number}   invite.senderId           Id of the person who send the invite.
 * @apiSuccess {Number}   invite.householdId        Id of the household which the person was invited to.
 * @apiSuccess {Date}     invite.createdAt          Date of creation.
 * @apiSuccess {Date}     invite.updatedAt          Date of last update.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 OK
 * {
 *   "invite": {
 *     "id": 1,
 *     "validUntil": "2021-03-21T17:58:36.422Z",
 *     "wasUsed": false,
 *     "invitedEmail": "tomkaeppler@web.de",
 *     "link": "c27bc350-daca-4218-a2ae-90dc2be172ce",
 *     "senderId": 1,
 *     "householdId": "1",
 *     "updatedAt": "2021-03-14T17:58:36.423Z",
 *     "createdAt": "2021-03-14T17:58:36.423Z"
 *   }
 * }
 *
 * @apiError 400:BadRequest No or wrong json.
 * @apiError 401:Unauthorized Not logged in.
 * @apiError 404:NotFound No categories were found.
 */

/**
 * @api {put} /invites Update invite
 * @apiDescription Update/Use an invite
 * @apiName PutInvite
 * @apiGroup Invite
 *
 * @apiParam {Object} invite                  Invite object.
 * @apiParam {String} invite.link             Link which should be used.
 *
 * @apiSuccess {String} Response
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 202 OK
 *
 * @apiError 400:BadRequest No or wrong json.
 * @apiError 401:Unauthorized Not logged in.
 * @apiError 404:NotFound No categories were found.
 */

/**
 * @api {delete} /invites Delete invite
 * @apiDescription Deletes the invite with the specified id
 * @apiName DeleteInvite
 * @apiGroup Invite
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
