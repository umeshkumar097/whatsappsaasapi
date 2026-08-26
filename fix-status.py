import re
with open('server/services/payment-gateway.service.ts', 'r') as f: content = f.read()
content = content.replace('export async function getRazorpaySubscriptionStatus', 'export async function getCashfreeSubscriptionStatus')
content = re.sub(
r'export async function getCashfreeSubscriptionStatus\(gatewaySubscriptionId: string\) \{.*?\}',
r'''export async function getCashfreeSubscriptionStatus(gatewaySubscriptionId: string) {
  const response = await cashfreeRequest("GET", `/subscriptions/${gatewaySubscriptionId}`);
  return {
    status: response.subscription.status,
    currentStart: null,
    currentEnd: null,
  };
}''', content, flags=re.DOTALL)
with open('server/services/payment-gateway.service.ts', 'w') as f: f.write(content)
print("Done status")
