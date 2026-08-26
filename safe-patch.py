import re

with open('server/services/payment-gateway.service.ts', 'r') as f:
    content = f.read()

# 1. Simple replacements
content = content.replace('Razorpay', 'Cashfree').replace('razorpay', 'cashfree').replace('RAZORPAY', 'CASHFREE')

# 2. Add cashfreeRequest helper at the top (after imports)
cashfree_request_code = """
async function cashfreeRequest(method: string, path: string, data: any = null) {
  const provider = await getProviderConfig("cashfree");
  if (!provider) throw new Error("Cashfree is not configured");
  const isLive = provider.config?.isLive === true;
  const appId = isLive ? provider.config?.apiKey : provider.config?.apiKeyTest;
  const secretKey = isLive ? provider.config?.apiSecret : provider.config?.apiSecretTest;
  if (!appId || !secretKey) throw new Error("Cashfree credentials missing");
  const baseUrl = isLive ? "https://api.cashfree.com/api/v2" : "https://test.cashfree.com/api/v2";
  const axios = (await import("axios")).default;
  const response = await axios({ method, url: `${baseUrl}${path}`, headers: { "x-client-id": appId, "x-client-secret": secretKey, "Content-Type": "application/json" }, data });
  return response.data;
}
"""
if 'async function cashfreeRequest' not in content:
    content = content.replace('import { resolvePublicOrigin } from "./public-origin";', 'import { resolvePublicOrigin } from "./public-origin";\n' + cashfree_request_code)

with open('server/services/payment-gateway.service.ts', 'w') as f:
    f.write(content)
print("Safe patch 1 complete")
