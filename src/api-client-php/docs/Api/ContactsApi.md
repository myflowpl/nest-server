# OpenAPI\Client\ContactsApi



All URIs are relative to http://localhost, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**contactsControllerCreate()**](ContactsApi.md#contactsControllerCreate) | **POST** /contacts |  |
| [**contactsControllerFindAll()**](ContactsApi.md#contactsControllerFindAll) | **GET** /contacts |  |
| [**contactsControllerFindOne()**](ContactsApi.md#contactsControllerFindOne) | **GET** /contacts/{id} |  |
| [**contactsControllerRemove()**](ContactsApi.md#contactsControllerRemove) | **DELETE** /contacts/remove/{id}/active |  |
| [**contactsControllerUpdate()**](ContactsApi.md#contactsControllerUpdate) | **PATCH** /contacts/{id} |  |
| [**contactsV2ControllerFindAll()**](ContactsApi.md#contactsV2ControllerFindAll) | **GET** /v2/contacts |  |


## `contactsControllerCreate()`

```php
contactsControllerCreate($create_contact_dto): \OpenAPI\Client\Model\CreateContactResponse
```



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\ContactsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$create_contact_dto = new \OpenAPI\Client\Model\CreateContactDto(); // \OpenAPI\Client\Model\CreateContactDto

try {
    $result = $apiInstance->contactsControllerCreate($create_contact_dto);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ContactsApi->contactsControllerCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **create_contact_dto** | [**\OpenAPI\Client\Model\CreateContactDto**](../Model/CreateContactDto.md)|  | |

### Return type

[**\OpenAPI\Client\Model\CreateContactResponse**](../Model/CreateContactResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `contactsControllerFindAll()`

```php
contactsControllerFindAll($page_index, $page_size, $sort_by, $sort_dir): \OpenAPI\Client\Model\Contact[]
```



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\ContactsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$page_index = 1; // float
$page_size = 2; // float
$sort_by = 'email'; // string
$sort_dir = 'asc'; // string

try {
    $result = $apiInstance->contactsControllerFindAll($page_index, $page_size, $sort_by, $sort_dir);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ContactsApi->contactsControllerFindAll: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **page_index** | **float**|  | [optional] [default to 1] |
| **page_size** | **float**|  | [optional] [default to 2] |
| **sort_by** | **string**|  | [optional] [default to &#39;email&#39;] |
| **sort_dir** | **string**|  | [optional] [default to &#39;asc&#39;] |

### Return type

[**\OpenAPI\Client\Model\Contact[]**](../Model/Contact.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `contactsControllerFindOne()`

```php
contactsControllerFindOne($id): \OpenAPI\Client\Model\Contact
```



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\ContactsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$id = 3.4; // float

try {
    $result = $apiInstance->contactsControllerFindOne($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ContactsApi->contactsControllerFindOne: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **float**|  | |

### Return type

[**\OpenAPI\Client\Model\Contact**](../Model/Contact.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `contactsControllerRemove()`

```php
contactsControllerRemove($id): \OpenAPI\Client\Model\Contact
```



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\ContactsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$id = 3.4; // float

try {
    $result = $apiInstance->contactsControllerRemove($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ContactsApi->contactsControllerRemove: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **float**|  | |

### Return type

[**\OpenAPI\Client\Model\Contact**](../Model/Contact.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `contactsControllerUpdate()`

```php
contactsControllerUpdate($id, $update_contact_dto): \OpenAPI\Client\Model\Contact
```



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\ContactsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$id = 3.4; // float
$update_contact_dto = new \OpenAPI\Client\Model\UpdateContactDto(); // \OpenAPI\Client\Model\UpdateContactDto

try {
    $result = $apiInstance->contactsControllerUpdate($id, $update_contact_dto);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ContactsApi->contactsControllerUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **float**|  | |
| **update_contact_dto** | [**\OpenAPI\Client\Model\UpdateContactDto**](../Model/UpdateContactDto.md)|  | |

### Return type

[**\OpenAPI\Client\Model\Contact**](../Model/Contact.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `contactsV2ControllerFindAll()`

```php
contactsV2ControllerFindAll(): string[]
```



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\ContactsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);

try {
    $result = $apiInstance->contactsV2ControllerFindAll();
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ContactsApi->contactsV2ControllerFindAll: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

This endpoint does not need any parameter.

### Return type

**string[]**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
