# OpenAPI\Client\AuthApi



All URIs are relative to http://localhost, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**authControllerLogin()**](AuthApi.md#authControllerLogin) | **POST** /auth/login |  |
| [**authControllerMe()**](AuthApi.md#authControllerMe) | **GET** /auth/me |  |
| [**authControllerRegister()**](AuthApi.md#authControllerRegister) | **POST** /auth/register |  |


## `authControllerLogin()`

```php
authControllerLogin($auth_login_dto): \OpenAPI\Client\Model\AuthLoginResponse
```



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\AuthApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$auth_login_dto = new \OpenAPI\Client\Model\AuthLoginDto(); // \OpenAPI\Client\Model\AuthLoginDto

try {
    $result = $apiInstance->authControllerLogin($auth_login_dto);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AuthApi->authControllerLogin: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **auth_login_dto** | [**\OpenAPI\Client\Model\AuthLoginDto**](../Model/AuthLoginDto.md)|  | |

### Return type

[**\OpenAPI\Client\Model\AuthLoginResponse**](../Model/AuthLoginResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `authControllerMe()`

```php
authControllerMe(): \OpenAPI\Client\Model\MeResponse
```



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure Bearer (JWT) authorization: bearer
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new OpenAPI\Client\Api\AuthApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);

try {
    $result = $apiInstance->authControllerMe();
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AuthApi->authControllerMe: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**\OpenAPI\Client\Model\MeResponse**](../Model/MeResponse.md)

### Authorization

[bearer](../../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `authControllerRegister()`

```php
authControllerRegister($auth_register_dto): \OpenAPI\Client\Model\User
```



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new OpenAPI\Client\Api\AuthApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$auth_register_dto = new \OpenAPI\Client\Model\AuthRegisterDto(); // \OpenAPI\Client\Model\AuthRegisterDto

try {
    $result = $apiInstance->authControllerRegister($auth_register_dto);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AuthApi->authControllerRegister: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **auth_register_dto** | [**\OpenAPI\Client\Model\AuthRegisterDto**](../Model/AuthRegisterDto.md)|  | |

### Return type

[**\OpenAPI\Client\Model\User**](../Model/User.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
