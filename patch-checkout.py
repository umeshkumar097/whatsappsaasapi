import re

with open('client/src/components/modals/CheckoutPage.tsx', 'r') as f:
    content = f.read()

new_initiate = """  const initiateCashfreePayment = async (
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
      setIsProcessing(false);
    }
  };"""

start = content.find("  const initiateCashfreePayment = async (")
end = content.find("  const initiateStripePayment = async (")

if start != -1 and end != -1:
    content = content[:start] + new_initiate + "\n\n" + content[end:]
    with open('client/src/components/modals/CheckoutPage.tsx', 'w') as f:
        f.write(content)
    print("Checkout patched successfully")
else:
    print("Could not find bounds")
    
