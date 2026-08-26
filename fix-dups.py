import re

with open('server/services/payment-gateway.service.ts', 'r') as f:
    content = f.read()

# Delete duplicate cancelStripeSubscription
content = re.sub(r'export async function cancelStripeSubscription\([\s\S]*?return \{.*?\}[\s\S]*?\}[\s\S]*?export async function cancelStripeSubscription', 'export async function cancelStripeSubscription', content, count=1)

# Delete bad cancelCashfreeSubscription (the one with getCashfree)
content = re.sub(r'export async function cancelCashfreeSubscription\([\s\S]*?getCashfree\(\);[\s\S]*?\}[\s\S]*?export async function getStripeSubscriptionStatus', 'export async function getStripeSubscriptionStatus', content, count=1)

with open('server/services/payment-gateway.service.ts', 'w') as f:
    f.write(content)
print("Fixed duplicates")
