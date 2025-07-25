import loadRazorpay from "../utils/loadRazorpay";
import { submitOrderHistory, sendOrderMail} from "../api/apiconsume"; // Adjust the import path as necessary

const handlePayment = async ({
  total,
  removeAllFromCart,
  setRecentPurchaseOrder,
  cart,
  user,
  mobile_number,
  address,
  navigate
}) => {
  const res = await loadRazorpay();

  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

  // Call your backend to create an order and get the order_id
  // const data = await fetch('http://localhost:5000/razorpay/order', {
  //   method: 'POST',
  // }).then((t) => t.json());

  const options = {
    key: process.env.REACT_APP_rajorpayKey, // from Razorpay dashboard
    amount: `${total * 100}`, // Amount in paise (Razorpay uses paise)
    currency: "INR",
    name: "Groceries Store",
    description: "Test Transaction",
    handler: async function (response) {
      // This gets called when payment is successful
      const paymentData = {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
        // cartItems,
        total,
        // userId,
      };

      //   // Send payment data to backend for verification + save order
      //   fetch("/api/payment/verify", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(paymentData),
      //   })
      //     .then((res) => res.json())
      //     .then((data) => {
      //       // Show confirmation or redirect to order summary
      //       console.log("Order saved:", data.order);
      //     });
      // fetch(razorpay.payments.fetch(razorpay_payment_id)).then((res) => console.log('aa gaya ', res.json()));

      // // Fetch order details
      // const order = await razorpay.orders.fetch(razorpay_order_id);
      await submitOrderHistory({uid : user?.uid, transaction_id: paymentData.razorpay_payment_id,  mobile_number, address, data: [...cart]})
      removeAllFromCart(); // Clear cart after successful payment
      setTimeout(() => {
        sendOrderMail({
          user_id: user?.uid,
          order_id: paymentData.razorpay_payment_id,})
      }, 500)
      setTimeout(async () => {
        await setRecentPurchaseOrder( {transaction_id: paymentData.razorpay_payment_id, mobile_number, address, items: [...cart]});
      }, 300);
      navigate("/cart"); // Redirect to order history page
    },
    prefill: {
      name: "Sumit Vishwakarma",
      email: "sumitvishwakarma6767@gmail.com",
      contact: "8237511757",
    },
    theme: {
      color: "#3399cc",
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};

export default handlePayment;
