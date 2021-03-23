/**
 * @api {get} /users Get all users
 * @apiDescription Returns all users
 * @apiName GetAllUsers
 * @apiGroup Users
 *
 * @apiSuccess {Object[]} users             Array of users.
 *
 * @apiSuccess {Object} users.user                One user from the array.
 *
 * @apiSuccess {Number}     users.user.id               Users unique id.
 * @apiSuccess {String}     users.user.firstName        Users firstname.
 * @apiSuccess {String}     users.user.lastName         Users lastname.
 * @apiSuccess {String}     users.user.email            Users email.
 * @apiSuccess {String}     users.user.createdAt        Date of creation.
 * @apiSuccess {String}     users.user.updatedAt        Date of last update.
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "users": [
 *          {
 *              "id": 1,
 *              "firstName": "firstName",
 *              "lastName": "lastName",
 *              "email": "email@mail.com",
 *              "createdAt": "2020-06-16T16:00:04.000Z",
 *              "updatedAt": "2020-06-16T16:00:04.000Z"
 *          },
 *          {
 *              "id": 2,
 *              "firstName": "firstName2",
 *              "lastName": "lastName2",
 *              "email": "email2@mail.com",
 *              "createdAt": "2020-06-16T16:00:04.000Z",
 *              "updatedAt": "2020-06-16T16:00:04.000Z"
 *          }
 *      ]
 *  }
 *
 * @apiError 401:Unauthorized Not logged in (no JWT token in header).
 * @apiError 404:UserNotFound No user was found.
 */

/**
 * @api {get} /users/:id Get user with id
 * @apiName GetUserWithId
 * @apiGroup Users
 *
 * @ApiParam {Number} id Users unique id
 *
 * @apiSuccess {Object} user                One user from the array.
 *
 * @apiSuccess {Number}     user.id                 Users unique id.
 * @apiSuccess {String}     user.firstName          Users firstname.
 * @apiSuccess {String}     user.lastName           Users lastname.
 * @apiSuccess {String}     user.email              Users email.
 * @apiSuccess {String}     user.createdAt          Date of creation.
 * @apiSuccess {String}     user.updatedAt          Date of last update.
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "user": {
 *          "id": 1,
 *          "firstName": "firstName",
 *          "lastName": "lastName",
 *          "email": "email@mail.com",
 *          "createdAt": "2020-06-16T16:00:04.000Z",
 *          "updatedAt": "2020-06-16T16:00:04.000Z",
 *      }
 *  }
 *
 * @apiError 401:Unauthorized Not logged in (no JWT token in header).
 * @apiError 404: UserNotFound The User with the <code>id</code> was not found.
 *
 */

/**
 * @api {post} /users Create user
 * @apiDescription This should not be used (just here for the crud) -> Use api/users/register instead
 * @apiName CreateUser
 * @apiGroup Users
 *
 * @apiExample {json} Request (example):
 *      {
 *          "user": {
 *              "firstName": "firstName",
 *              "lastName": "lastName",
 *              "email": "email@mail.com",
 *              "passwordHash": "alreadyHashed",
 *          }
 *      }
 *
 * @apiSuccess {Object} user                One user from the array.
 *
 * @apiSuccess {Number}     user.id                 Users unique id.
 * @apiSuccess {String}     user.firstName          Users firstname.
 * @apiSuccess {String}     user.lastName           Users lastname.
 * @apiSuccess {String}     user.email              Users email.
 * @apiSuccess {String}     user.createdAt          Date of creation.
 * @apiSuccess {String}     user.updatedAt          Date of last update.
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 201 OK
 *  {
 *      "user": {
 *          "id": 1,
 *          "firstName": "firstName",
 *          "lastName": "lastName",
 *          "email": "email@mail.com",
 *          "createdAt": "2020-06-16T16:00:04.000Z",
 *          "updatedAt": "2020-06-16T16:00:04.000Z"
 *      }
 *  }
 *
 * @apiError 401:Unauthorized Not logged in (no JWT token in header).
 * @apiError 404:UserNotFound The User with the <code>id</code> was not created.
 *
 */

/**
 * @api {put} /users/:id Update user with id
 * @apiName UpdateUserWithId
 * @apiGroup Users
 *
 * @apiExample {json} Request (example):
 *      json-body:
 *      {
 *          "user": {
 *              "firstName": "firstName",
 *              "lastName": "lastName",
 *              "email": "email@mail.com",
 *              "passwordHash": "newPasswordHash",
 *          }
 *      }
 *
 * @apiSuccess {Object} user                One user from the array.
 *
 * @apiSuccess {Number} user.id             Users unique id.
 * @apiSuccess {String} user.firstName      Users firstname.
 * @apiSuccess {String} user.lastName       Users lastname.
 * @apiSuccess {String} user.email          Users email.
 * @apiSuccess {String} user.createdAt      Date of creation.
 * @apiSuccess {String} user.updatedAt      Date of last update.
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 202 OK
 *  {
 *      "user": {
 *          "id": 1,
 *          "firstName": "firstName",
 *          "lastName": "lastName",
 *          "email": "email@mail.com",
 *          "passwordHash": "newPasswordHash"
 *          "createdAt": "2020-06-16T16:00:04.000Z",
 *          "updatedAt": "2020-06-16T16:00:04.000Z",
 *      }
 *  }
 *
 * @apiError 401:Unauthorized Not logged in (no JWT token in header).
 * @apiError 403:Forbidden Logged in user does not have the permission to update users.
 * @apiError 404:UserCouldNotBeUpdated The User with the <code>id</code> could not be updated.
 *
 *
 */

/**
 * @api {delete} /users/:id Delete user with id
 * @apiName DeleteUser
 * @apiGroup Users
 *
 * @apiSuccess 204 User was deleted and no content is returned
 *
 * @apiError 401:Unauthorized Not logged in (no JWT token in header).
 * @apiError 403:Forbidden Logged in user does not have the permission to delete users.
 * @apiError 404:UserCouldNotBeDeleted The User with the <code>id</code> could not be deleted.
 *
 */

/**
 * @api {post} /sigin Sigin
 * @apiName Signin
 * @apiGroup Users
 *
 * @apiExample {json} Request (example):
 *      json-body:
 *      {
 *      	"user" : {
 *      		"email" : "t@mail.com",
 *      		"password" : "12345678"
 *      	}
 *      }
 *
 * @apiSuccess {String} token   jwt token for cookie.
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "token": "jwtToken"
 *  }
 * @apiError 403:Forbidden Could not login. Account is marked as deleted.
 * @apiError 404:UserNotFound Could not find user with this email or password.
 *
 */

/**
 * @api {post} /sigup Sigup
 * @apiName Signup
 * @apiGroup Users
 *
 * @apiExample {json} Request (example):
 *      json-body:
 *      {
 *      	"user" : {
 *      		"firstName" : "Post",
 *      		"lastName" : "Man",
 *      		"email" : "post@mail.com",
 *      		"password" : "12345678"
 *      	}
 *      }
 *
 * @apiSuccess {Object} user                One user from the array.
 *
 * @apiSuccess {Number} user.id                  Users unique id.
 * @apiSuccess {String} user.firstName           Users firstname.
 * @apiSuccess {String} user.lastName            Users lastname.
 * @apiSuccess {String} user.email               Users email.
 * @apiSuccess {String} user.createdAt           Date of creation.
 * @apiSuccess {String} user.updatedAt           Date of last update.
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 201 OK
 *  {
 *      "user": {
 *          "id": 3,
 *          "firstName": "Post",
 *          "lastName": "Man",
 *          "email": "post@mail.com",
 *          "passwordHash": "$2b$10$U09i1GZ0GZttaNF5efMKZOQVtHBSLbQlB1FWVqQu.wR7Ih0YTfTsq",
 *          "updatedAt": "2020-06-18T12:43:09.774Z",
 *          "createdAt": "2020-06-18T12:43:09.774Z"
 *      }
 *  }
 *
 *  @apiError 404:UserNotFound Could not find user with this email or password.
 *
 */

/**
 * @api {get} /signout Signout
 * @apiName Signout
 * @apiGroup Users
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK{}
 *
 * @apiError 404:UserNotFound Could not be logged out.
 *
 */
