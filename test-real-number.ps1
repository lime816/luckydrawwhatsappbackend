# Test webhook with real phone number
$testPayload = @{
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
                                from = "918281348343"
                                id = "test_message_real_number"
                                timestamp = ([DateTimeOffset]::UtcNow.ToUnixTimeSeconds()).ToString()
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

Write-Host "Testing webhook with real phone number: 918281348343"
Write-Host "Sending message: 'hello'"
Write-Host "Expected trigger: Should send 'Hello! Please complete this form:'"
Write-Host ""
Write-Host "Payload:"
Write-Host $testPayload
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri "https://whatsappbackend-production-8946.up.railway.app/webhook" -Method POST -Body $testPayload -ContentType "application/json" -Verbose
    Write-Host "✅ Success! Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
    Write-Host ""
    Write-Host "🎉 This means your webhook automation is working!"
    Write-Host "The system should have attempted to send an automated reply."
} catch {
    Write-Host "❌ Error occurred:"
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    Write-Host "Error Message: $($_.Exception.Message)"
    
    if ($_.Exception.Response) {
        try {
            $responseStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($responseStream)
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response Body: $responseBody"
        } catch {
            Write-Host "Could not read response body"
        }
    }
}

Write-Host ""
Write-Host "=" * 60
Write-Host "Next Steps:"
Write-Host "1. If you see 'Recipient phone number not in allowed list' error:"
Write-Host "   - This is normal for unpublished apps"
Write-Host "   - Add 918281348343 to your WhatsApp Business API allowed recipients"
Write-Host "   - Go to Meta Developer Console → WhatsApp → API Setup → Recipients"
Write-Host ""
Write-Host "2. If successful:"
Write-Host "   - Your automation is fully working!"
Write-Host "   - The number 918281348343 should receive the automated message"
Write-Host ""
Write-Host "3. To test with real WhatsApp:"
Write-Host "   - Send 'hello' or 'register' from 918281348343 to your business number"
Write-Host "   - Should receive automated responses"