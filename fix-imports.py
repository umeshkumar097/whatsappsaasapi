with open('server/services/payment-gateway.service.ts', 'r') as f:
    content = f.read()

content = content.replace('import Cashfree from "cashfree";\n', '')
content = content.replace('import Cashfree from "cashfree";', '')
content = content.replace('let cashfreeInstance: any | null = null;\n', '')
content = content.replace('let cashfreeInstance: Razorpay | null = null;\n', '')
content = content.replace('let cashfreeInstance: Cashfree | null = null;\n', '')

with open('server/services/payment-gateway.service.ts', 'w') as f:
    f.write(content)
print("Removed cashfree imports")
