### Description

This API can be used to **CRUD** everything available for our website. As well as handling login/logout and registering

### General API

This API has predictable resource-oriented URLs, mostly accepts JSON, returns JSON responses
and uses standard HTTP response codes and authentication

For most of the endpoints you need to be authenticated (see: Used Headers).

The exact usage for the single endpoints can be seen lower down in the documentation

#### Responses

-   200 Standard response for successful requests
-   201 The request has been fulfilled, resulting in the creation of a new resource
-   203 The request has been fulfilled, resulting in the update of a resource
-   204 The request has been fulfilled, resulting in the deletion of a resource -> Returning no content
-   401 The request has not been fulfilled, the sender has send no authentication
-   403 The request has not been fulfilled, the sender does not have the permission to do this
-   404 The requested resource could not be found

### Used Headers

We use a **Bearer Token** for authentication

Set as a cookie with the name **planbook_auth_jwt** containing a jwt token
