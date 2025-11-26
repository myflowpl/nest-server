# AuthApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**authControllerLogin**](#authcontrollerlogin) | **POST** /auth/login | |
|[**authControllerMe**](#authcontrollerme) | **GET** /auth | |
|[**authControllerRegister**](#authcontrollerregister) | **POST** /auth/register | |

# **authControllerLogin**
> AuthLoginResponse authControllerLogin(authLoginDto)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    AuthLoginDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let authLoginDto: AuthLoginDto; //

const { status, data } = await apiInstance.authControllerLogin(
    authLoginDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **authLoginDto** | **AuthLoginDto**|  | |


### Return type

**AuthLoginResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerMe**
> Array<object> authControllerMe()


### Example

```typescript
import {
    AuthApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

const { status, data } = await apiInstance.authControllerMe();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<object>**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |
|**401** | Unauthorized: JWT teoken required |  -  |
|**403** | Forbidden: Extra roles required |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerRegister**
> User authControllerRegister(authRegisterDto)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    AuthRegisterDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let authRegisterDto: AuthRegisterDto; //

const { status, data } = await apiInstance.authControllerRegister(
    authRegisterDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **authRegisterDto** | **AuthRegisterDto**|  | |


### Return type

**User**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

