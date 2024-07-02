# ecommerce-server

This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build ecommerce-server` to build the library.

## Running unit tests

Run `nx test ecommerce-server` to execute the unit tests via [Jest](https://jestjs.io).

# Define the URL of your webhook endpoint

$url = "https://c2b8-181-169-153-185.ngrok-free.app/v1/binance/webhook"

# Create random data for the POST request

$randomData = @{
key1 = "value1"
key2 = "value2"
key3 = "value3"
} | ConvertTo-Json

# Send the POST request

try {
$response = Invoke-RestMethod -Uri $url -Method Post -Body $randomData -ContentType "application/json"
Write-Host "Response:" $response
} catch {
Write-Host "Error:" $\_.Exception.Message
}
