import React from "react";

const RazorpayButton = ({ amount, onSuccess, onError }) => {
  const handlePayment = () => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      name: "TrendDrift",
      description: "Order Payment",
      handler: function (response) {
        // response contains: razorpay_payment_id, razorpay_order_id, razorpay_signature
        onSuccess(response);
      },
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      theme: {
        color: "#019dc0",
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment failed", function (response) {
      if (onError) {
        onError(response.error);
      }
    });

    razorpay.open();
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        className="
    relative w-full
    bg-gradient-to-r from-[#017a96] via-[#019dc0] to-[#01b4db]
    hover:from-[#016a82] hover:via-[#018aaa] hover:to-[#019dc0]
    text-white font-semibold tracking-wide
    py-2 rounded-xl
    shadow-lg shadow-[#019dc0]/40
    hover:shadow-[#019dc0]/60
    transform 
    transition-all duration-300
    flex items-center justify-center 
    cursor-pointer
  "
      >
        <img
          src="https://razorpay.com/assets/razorpay-glyph.svg"
          alt="Razorpay"
          className="w-14 h-14 object-contain"
        />

        <span>Pay Securely with Razorpay</span>
      </button>
      <p className="text-xs text-gray-500 text-center mt-2">
        🔒 100% Secure Payment • UPI • Cards • Net Banking
      </p>
    </div>
  );
};

export default RazorpayButton;
