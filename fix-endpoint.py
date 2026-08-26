import re

filepath = 'server/services/payment-gateway.service.ts'
with open(filepath, 'r') as f:
    content = f.read()

# Replace "/subscriptions/plans" with "/subscription-plans"
content = content.replace('"/subscriptions/plans"', '"/subscription-plans"')

with open(filepath, 'w') as f:
    f.write(content)
print("Fixed endpoint")
