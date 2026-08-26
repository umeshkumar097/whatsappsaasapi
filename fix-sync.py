with open('server/services/payment-gateway.service.ts', 'r') as f:
    content = f.read()

# Replace the sync logic to force new plans with maxAmount
sync_old_m = 'amount: monthlyAmount, intervals: 1, intervalType: "MONTH" }'
sync_new_m = 'amount: monthlyAmount, maxAmount: monthlyAmount * 10, intervals: 1, intervalType: "MONTH" }'

sync_old_a = 'amount: annualAmount, intervals: 1, intervalType: "YEAR" }'
sync_new_a = 'amount: annualAmount, maxAmount: annualAmount * 10, intervals: 1, intervalType: "YEAR" }'

content = content.replace(sync_old_m, sync_new_m)
content = content.replace(sync_old_a, sync_new_a)

# We need to force it to create a NEW plan. Let's just change the prefix
content = content.replace('`p_${planId.substring(0, 8)}_m`', '`p2_${planId.substring(0, 8)}_m`')
content = content.replace('`p_${planId.substring(0, 8)}_a`', '`p2_${planId.substring(0, 8)}_a`')

with open('server/services/payment-gateway.service.ts', 'w') as f:
    f.write(content)
print("Patched sync logic")
