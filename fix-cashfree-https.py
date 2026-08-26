with open('server/services/payment-gateway.service.ts', 'r') as f:
    content = f.read()

# find createCashfreeSubscription function and replace the return_url part
content = content.replace('subscription_meta: { return_url: `${appUrl}/payment/success?provider=cashfree` }', 'subscription_meta: { return_url: `${appUrl.replace("http://", "https://")}/payment/success?provider=cashfree` }')

with open('server/services/payment-gateway.service.ts', 'w') as f:
    f.write(content)
print("Patched createCashfreeSubscription for https")
