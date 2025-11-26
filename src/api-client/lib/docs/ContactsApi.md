# ContactsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**contactsControllerCreate**](#contactscontrollercreate) | **POST** /contacts | |
|[**contactsControllerDelete**](#contactscontrollerdelete) | **DELETE** /contacts/remove/{id}/active | |
|[**contactsControllerFindAll**](#contactscontrollerfindall) | **GET** /contacts | |
|[**contactsControllerFindAllActive**](#contactscontrollerfindallactive) | **GET** /contacts/active | |
|[**contactsControllerUpdate**](#contactscontrollerupdate) | **PATCH** /contacts/{id} | |

# **contactsControllerCreate**
> Contact contactsControllerCreate(createContactDto)


### Example

```typescript
import {
    ContactsApi,
    Configuration,
    CreateContactDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ContactsApi(configuration);

let createContactDto: CreateContactDto; //

const { status, data } = await apiInstance.contactsControllerCreate(
    createContactDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createContactDto** | **CreateContactDto**|  | |


### Return type

**Contact**

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

# **contactsControllerDelete**
> Contact contactsControllerDelete()


### Example

```typescript
import {
    ContactsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ContactsApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.contactsControllerDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**Contact**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |
|**404** | Contact not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contactsControllerFindAll**
> Array<Contact> contactsControllerFindAll()


### Example

```typescript
import {
    ContactsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ContactsApi(configuration);

let pageIndex: number; // (optional) (default to 0)
let pageSize: number; // (optional) (default to 2)

const { status, data } = await apiInstance.contactsControllerFindAll(
    pageIndex,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageIndex** | [**number**] |  | (optional) defaults to 0|
| **pageSize** | [**number**] |  | (optional) defaults to 2|


### Return type

**Array<Contact>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contactsControllerFindAllActive**
> contactsControllerFindAllActive()


### Example

```typescript
import {
    ContactsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ContactsApi(configuration);

const { status, data } = await apiInstance.contactsControllerFindAllActive();
```

### Parameters
This endpoint does not have any parameters.


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
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **contactsControllerUpdate**
> Contact contactsControllerUpdate(createContactDto)


### Example

```typescript
import {
    ContactsApi,
    Configuration,
    CreateContactDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ContactsApi(configuration);

let id: number; // (default to undefined)
let createContactDto: CreateContactDto; //

const { status, data } = await apiInstance.contactsControllerUpdate(
    id,
    createContactDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createContactDto** | **CreateContactDto**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**Contact**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |
|**404** | Contact not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

