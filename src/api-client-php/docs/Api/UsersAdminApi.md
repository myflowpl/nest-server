# OpenAPI\Client\UsersAdminApi



All URIs are relative to http://localhost, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**usersAdminControllerAddRole()**](UsersAdminApi.md#usersAdminControllerAddRole) | **POST** /users-admin/user/add-role |  |
| [**usersAdminControllerRemoveRole()**](UsersAdminApi.md#usersAdminControllerRemoveRole) | **DELETE** /users-admin/user/remove-role |  |
| [**usersAdminControllerSearch()**](UsersAdminApi.md#usersAdminControllerSearch) | **GET** /users-admin/search |  |
| [**usersAdminControllerSearchPromise()**](UsersAdminApi.md#usersAdminControllerSearchPromise) | **GET** /users-admin/search-promise |  |


## `usersAdminControllerAddRole()`

```php
usersAdminControllerAddRole($add_role_dto)
```



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\UsersAdminApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$add_role_dto = new \OpenAPI\Client\Model\AddRoleDto(); // \OpenAPI\Client\Model\AddRoleDto

try {
    $apiInstance->usersAdminControllerAddRole($add_role_dto);
} catch (Exception $e) {
    echo 'Exception when calling UsersAdminApi->usersAdminControllerAddRole: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **add_role_dto** | [**\OpenAPI\Client\Model\AddRoleDto**](../Model/AddRoleDto.md)|  | |

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `usersAdminControllerRemoveRole()`

```php
usersAdminControllerRemoveRole($add_role_dto)
```



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\UsersAdminApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$add_role_dto = new \OpenAPI\Client\Model\AddRoleDto(); // \OpenAPI\Client\Model\AddRoleDto

try {
    $apiInstance->usersAdminControllerRemoveRole($add_role_dto);
} catch (Exception $e) {
    echo 'Exception when calling UsersAdminApi->usersAdminControllerRemoveRole: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **add_role_dto** | [**\OpenAPI\Client\Model\AddRoleDto**](../Model/AddRoleDto.md)|  | |

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `usersAdminControllerSearch()`

```php
usersAdminControllerSearch(): object
```



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\UsersAdminApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);

try {
    $result = $apiInstance->usersAdminControllerSearch();
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling UsersAdminApi->usersAdminControllerSearch: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

This endpoint does not need any parameter.

### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `usersAdminControllerSearchPromise()`

```php
usersAdminControllerSearchPromise(): string
```



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\UsersAdminApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);

try {
    $result = $apiInstance->usersAdminControllerSearchPromise();
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling UsersAdminApi->usersAdminControllerSearchPromise: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

This endpoint does not need any parameter.

### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
