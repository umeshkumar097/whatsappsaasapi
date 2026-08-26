import axios from "axios";

async function main() {
  try {
    const payload = {
      order_id: "test_order_" + Date.now(),
      order_amount: 100,
      order_currency: "INR",
      customer_details: {
        customer_id: "usr_123",
        customer_phone: "9999999999"
      }
    };
    const res = await axios.post("https://api.cashfree.com/pg/orders", payload, {
      headers: {
        "x-client-id": "134239153569b2e4371d9db1ea11932431",
        "x-client-secret": "cfsk_ma_prod_807ffe1d0bcb6cf4b8b2cd2e2abbfe08_47a8f452",
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json"
      }
    });
    console.log(res.data);
  } catch (e: any) {
    console.log(e.response?.data || e.message);
  }
}
main();
