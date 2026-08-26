with open('server/services/payment-gateway.service.ts', 'r') as f:
    content = f.read()

import re

# Remove the check if plan is synced
content = re.sub(r'const cfPlanId = .*?;', '', content)
content = re.sub(r'if \(!cfPlanId\) throw new Error\(`Plan not synced to Cashfree`\);', '', content)

# Replace plan_details with inline details
old_plan_details = 'plan_details: { plan_id: cfPlanId },'
new_plan_details = '''plan_details: { 
        plan_name: `${plan.name} - ${billingCycle === "annual" ? "Annual" : "Monthly"}`,
        plan_type: "PERIODIC",
        plan_currency: "INR",
        plan_recurring_amount: amount,
        plan_max_amount: amount * 10,
        plan_intervals: 1,
        plan_interval_type: billingCycle === "annual" ? "YEAR" : "MONTH"
      },'''

content = content.replace(old_plan_details, new_plan_details)

with open('server/services/payment-gateway.service.ts', 'w') as f:
    f.write(content)
print("Patched createCashfreeSubscription")
