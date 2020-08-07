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

Set as a cookie with the name **\_wab_auth_jwt** containing a jwt token

### Permission System

The implemented permission system uses a 16Bit String for which every Bit stands for specific permission
For example: **0000 0000 0000 0000** The user does not have any permissions set

Currently not every bit has a corresponding permission. So it can be expanded in the future

Not used:

-   1000000000000000
-   0100000000000000
-   0010000000000000
-   0001000000000000
-   0000100000000000
-   0000010000000000
-   0000001000000000

Used:

-   0000000100000000 : **256** : can delete user
-   0000000010000000 : **128** : can update user
-   0000000001000000 : **64** : can delete task
-   0000000000100000 : **32** : can update task
-   0000000000010000 : **16** : can create task
-   0000000000001000 : **8** : can delete project
-   0000000000000100 : **4** : can update project
-   0000000000000010 : **2** : can create project
-   0000000000000001 : **1** : is deleted?

The last bit is used as a flag for account deletion
