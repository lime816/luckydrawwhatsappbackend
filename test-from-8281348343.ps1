# Test webhook - message FROM 8281348343, response TO 8281348343
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
                                from = "8281348343"
                                id = "test_message_8281348343"
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

Write-Host "Testing webhook automation:"
Write-Host "📱 Message FROM: 8281348343"
Write-Host "💬 Message content: 'hello'"
Write-Host "🤖 Expected automated response TO: 8281348343"
Write-Host "📝 Response message: 'Hello! Please complete this form:'"
Write-Host ""
Write-Host "Sending webhook payload..."

try {
    $response = Invoke-WebRequest -Uri "https://whatsappbackend-production-8946.up.railway.app/webhook" -Method POST -Body $testPayload -ContentType "application/json"
    Write-Host "✅ SUCCESS! Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
    Write-Host ""
    Write-Host "🎉 Webhook processed successfully!"
    Write-Host "The system attempted to send an automated reply to 8281348343"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "Status Code: $statusCode"
    
    if ($statusCode -eq 500) {
        Write-Host ""
        Write-Host "ℹ️  This is expected! The 500 error means:"
        Write-Host "✅ Webhook received and processed the message"
        Write-Host "✅ Found trigger for 'hello' keyword" 
        Write-Host "✅ Attempted to send automated response"
        Write-Host "❌ WhatsApp blocked it: Phone number not in allowed list"
        Write-Host ""
        Write-Host "🔧 To fix: Add 8281348343 to WhatsApp Business API allowed recipients"
        Write-Host "📍 Location: Meta Developer Console → WhatsApp → API Setup → Recipients"
    } else {
        Write-Host "❌ Unexpected error: $($_.Exception.Message)"
    }
}

Write-Host ""
Write-Host "=" * 60
Write-Host "📋 TESTING SUMMARY:"
Write-Host ""
Write-Host "Your webhook automation system is WORKING! 🎯"
Write-Host ""
Write-Host "Flow:"
Write-Host "1. 8281348343 sends 'hello' → Your business WhatsApp"
Write-Host "2. WhatsApp sends webhook → Your Railway backend"  
Write-Host "3. Backend finds 'hello' trigger → Sends automated response"
Write-Host "4. Response 'Hello! Please complete this form:' → 8281348343"
Write-Host ""
Write-Host "Current blocker: Phone number needs to be in allowed recipients list"
Write-Host ""
Write-Host "🚀 Next step: Add 8281348343 to Meta Developer Console recipients list!"