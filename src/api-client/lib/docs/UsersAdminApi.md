# UsersAdminApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**usersAdminControllerAddRole**](#usersadmincontrolleraddrole) | **POST** /users-admin/roles | |
|[**usersAdminControllerError**](#usersadmincontrollererror) | **GET** /users-admin/error | |
|[**usersAdminControllerRemoveRole**](#usersadmincontrollerremoverole) | **DELETE** /users-admin/roles/{userId}/{roleName} | |

# **usersAdminControllerAddRole**
> usersAdminControllerAddRole(addRoleDto)


### Example

```typescript
import {
    UsersAdminApi,
    Configuration,
    AddRoleDto
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersAdminApi(configuration);

let addRoleDto: AddRoleDto; //

const { status, data } = await apiInstance.usersAdminControllerAddRole(
    addRoleDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **addRoleDto** | **AddRoleDto**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **usersAdminControllerError**
> usersAdminControllerError()


### Example

```typescript
import {
    UsersAdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersAdminApi(configuration);

let type: string; // (default to undefined)

const { status, data } = await apiInstance.usersAdminControllerError(
    type
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **type** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **usersAdminControllerRemoveRole**
> usersAdminControllerRemoveRole()


### Example

```typescript
import {
    UsersAdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersAdminApi(configuration);

let userId: string; // (default to undefined)
let roleName: 'admin' | 'root'; // (default to undefined)

const { status, data } = await apiInstance.usersAdminControllerRemoveRole(
    userId,
    roleName
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] |  | defaults to undefined|
| **roleName** | [**&#39;admin&#39; | &#39;root&#39;**]**Array<&#39;admin&#39; &#124; &#39;root&#39;>** |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

