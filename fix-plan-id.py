import re

filepath = 'server/services/payment-gateway.service.ts'
with open(filepath, 'r') as f:
    content = f.read()

# I will replace the planId generation in syncPlanToCashfree
new_monthly = r'monthlyPlanId = `p_${planId.substring(0, 8)}_m`;'
new_annual = r'annualPlanId = `p_${planId.substring(0, 8)}_a`;'

content = re.sub(r'monthlyPlanId = `plan_\$\{planId\}_monthly`;', new_monthly, content)
content = re.sub(r'annualPlanId = `plan_\$\{planId\}_annual`;', new_annual, content)

with open(filepath, 'w') as f:
    f.write(content)
print("Fixed plan generation")
