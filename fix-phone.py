with open('server/services/payment-gateway.service.ts', 'r') as f:
    content = f.read()

# Replace customer_phone: user.phone || "9999999999" with a check
search_str = 'customer_phone: user.phone || "9999999999"'
replace_str = 'customer_phone: (user.phone && user.phone.length >= 10 && user.phone !== "9999999999" && user.phone !== "0000000000") ? user.phone.replace(/[^0-9]/g, "").slice(-10) : "9876543210"'

content = content.replace(search_str, replace_str)

with open('server/services/payment-gateway.service.ts', 'w') as f:
    f.write(content)
print("Patched customer_phone")
