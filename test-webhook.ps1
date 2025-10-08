# Test WhatsApp Webhook - Simulate incoming message

# Test 1: Send "hello" message to webhook
$testMessage1 = @{
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
                                id = "wamid.test123"
                                timestamp = "1696743600"
                                text = @{
                                    body = "hello"
                                }
                                type = "text"
                            }
                        )
                    }
                    field = "messages"
                }
            )
        }
    )
} | ConvertTo-Json -Depth 10

Write-Host "Testing webhook with 'hello' message..."
Write-Host "Payload: $testMessage1"

try {
    $response1 = Invoke-WebRequest -Uri "https://whatsappbackend-production-8946.up.railway.app/webhook" -Method POST -Body $testMessage1 -ContentType "application/json"
    Write-Host "Response Status: $($response1.StatusCode)"
    Write-Host "Response Body: $($response1.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

Write-Host "`n" + "="*50 + "`n"

# Test 2: Send "register" message to webhook
$testMessage2 = @{
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
                                id = "wamid.test456"
                                timestamp = "1696743660"
                                text = @{
                                    body = "register"
                                }
                                type = "text"
                            }
                        )
                    }
                    field = "messages"
                }
            )
        }
    )
} | ConvertTo-Json -Depth 10

Write-Host "Testing webhook with 'register' message..."

try {
    $response2 = Invoke-WebRequest -Uri "https://whatsappbackend-production-8946.up.railway.app/webhook" -Method POST -Body $testMessage2 -ContentType "application/json"
    Write-Host "Response Status: $($response2.StatusCode)"
    Write-Host "Response Body: $($response2.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}