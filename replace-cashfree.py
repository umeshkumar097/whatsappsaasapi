import os
import io

def replace_in_file(filepath):
    try:
        with io.open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return
    
    new_content = content.replace('razorpay', 'cashfree').replace('Razorpay', 'Cashfree').replace('RAZORPAY', 'CASHFREE')
    if new_content != content:
        with io.open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Updated: " + filepath)

for root, dirs, files in os.walk('client/src'):
    for file in files:
        if file.endswith(('.ts', '.tsx', '.json')):
            replace_in_file(os.path.join(root, file))
