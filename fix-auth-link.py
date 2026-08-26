import re

filepath = 'server/services/payment-gateway.service.ts'
with open(filepath, 'r') as f:
    content = f.read()

# Replace the return object in createCashfreeSubscription
old_return = 'return { subscriptionId: subId, shortUrl: response.subscription.authLink, status: response.subscription.status };'
new_return = 'return { subscriptionId: response.subReferenceId ? response.subReferenceId.toString() : subId, shortUrl: response.authLink, status: response.subStatus || "INITIALIZED" };'

content = content.replace(old_return, new_return)

with open(filepath, 'w') as f:
    f.write(content)
print("Fixed authLink")
