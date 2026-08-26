import re
with open('server/services/payment-gateway.service.ts', 'r') as f: content = f.read()
content = content.replace('export async function getRazorpayKeyId()', 'export async function getCashfreeKeyId()')
content = content.replace('getProviderConfig("razorpay")', 'getProviderConfig("cashfree")')
with open('server/services/payment-gateway.service.ts', 'w') as f: f.write(content)
print("Done key")
