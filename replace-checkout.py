import re

with open('client/src/components/modals/CheckoutPage.tsx', 'r') as f:
    content = f.read()

new_logic = """  const initiateCashfreePayment = async (
    paymentData: PaymentInitiationData
  ) => {
    try {
      if (paymentData.shortUrl) {
        window.location.href = paymentData.shortUrl;
      } else {
        throw new Error("Missing checkout URL from Cashfree");
      }
    } catch (error: any) {
      toast({
        title: "Checkout Error",
        description: error.message || "Failed to start checkout",
        variant: "destructive",
      });
      setLoading(false);
    }
  };"""

# Replace from `  const initiateCashfreePayment` to `    } catch (error: any) {\n      setLoading(false);\n      toast({\n        title: "Payment Failed",\n        description: "Failed to initialize payment. Please try again.",\n        variant: "destructive",\n      });\n    }\n  };\n`
start = content.find("  const initiateCashfreePayment = async (")
# Find the exact end of initiateCashfreePayment
end = content.find("  const initiateStripePayment = async (") 
# Stripe doesn't exist, let's look for `  const handlePayment = async (e: React.FormEvent) => {`
if end == -1:
    end = content.find("  const handlePayment = async (e: React.FormEvent) => {")

if start != -1 and end != -1:
    content = content[:start] + new_logic + "\n\n" + content[end:]
    with open('client/src/components/modals/CheckoutPage.tsx', 'w') as f:
        f.write(content)
    print("Patched checkout")
else:
    print("Could not find bounds")
    
