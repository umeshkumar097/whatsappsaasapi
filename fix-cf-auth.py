with open('server/services/payment-gateway.service.ts', 'r') as f:
    content = f.read()

import re
# Remove authorization_details completely
content = re.sub(r'authorization_details:\s*\{.*?\},?', '', content, flags=re.DOTALL)

with open('server/services/payment-gateway.service.ts', 'w') as f:
    f.write(content)
print("Patched createCashfreeSubscription to remove authorization_details")
