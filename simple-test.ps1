# Simple webhook test
$simplePayload = @{
    object = "whatsapp_business_account"
    entry = @(
        @{
            id = "164297206767745"
            changes = @(
                @{
                    value = @{
                        messaging_product = "whatsapp"
                        metadata = @{
                            display_phone_number = "15550617327" 
                            phone_number_id = "158282837372377"
                        }
                        messages = @(
                            @{
                                from = "1234567890"
                                id = "test_message_id"
                                timestamp = "1696743600"
                                type = "text"
                                text = @{
                                    body = "hello"
                                }
                            }
                        )
                    }
                    field = "messages"
                }
            )
        }
    )
} | ConvertTo-Json -Depth 10

Write-Host "Testing simple webhook payload..."
Write-Host "Payload:"
Write-Host $simplePayload

try {
    $response = Invoke-WebRequest -Uri "https://whatsappbackend-production-8946.up.railway.app/webhook" -Method POST -Body $simplePayload -ContentType "application/json" -Verbose
    Write-Host "Success! Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error occurred:"
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    Write-Host "Error Message: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $responseBody = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($responseBody)
        Write-Host "Response Body: $($reader.ReadToEnd())"
    }
}