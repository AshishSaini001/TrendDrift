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
        color: "#000000",
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
    bg-gradient-to-r from-orange-500 via-red-500 to-orange-600
    hover:from-orange-600 hover:via-red-600 hover:to-orange-700
    text-white font-semibold tracking-wide
    py-2 rounded-xl
    shadow-lg shadow-orange-500/40
    hover:shadow-orange-500/60
    transform hover:scale-[1.02]
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
