import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { useCart } from "../context/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

// Load your Stripe publishable key
const stripePromise = loadStripe("pk_test_51QH4Q1HpZQPWXTXAXpo9UcLoTgK7CgQX7Z4XiCNmMEPUYpLAKiNsFjQdIIfDQFFhP2KFDpAkw1h28OnOKvsMcfsi00nKtw7M0j");

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cart } = useCart();
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Retrieve totalPrice from location state
    const totalPrice = location.state?.totalPrice || 0;

    const handlePayment = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);

        const cardElement = elements.getElement(CardElement);

        try {
            const paymentMethod = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (paymentMethod.error) {
                setErrorMessage(paymentMethod.error.message);
                setLoading(false);
                return;
            }

            // Prepare order items for the API
            const orderItems = cart.map(item => ({
                productId: item.id,
                quantity: item.quantity
            }));

            const orderRequest = {
                totalPrice,
                items: orderItems,
                paymentMethodId: paymentMethod.paymentMethod.id,
            };

            const response = await ApiService.createOrder(orderRequest);

            if (response.status === 200) {
                // Payment successful, clear the cart and navigate to confirmation page
                setLoading(false);
                navigate("/confirmation");
            } else {
                setErrorMessage(response.message || "Payment failed");
                setLoading(false);
            }

        } catch (error) {
            setErrorMessage("An error occurred while processing the payment.");
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold text-center text-gray-800">Payment</h1>
                <h2 className="mt-2 text-xl text-center text-gray-600">Total: ${totalPrice.toFixed(2)}</h2>
                {errorMessage && <p className="mt-4 text-red-500 text-center">{errorMessage}</p>}
                <form onSubmit={handlePayment} className="mt-6">
                    <div className="mb-4">
                        <CardElement className="border border-gray-300 p-2 rounded-md" />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading || !stripe} 
                        className={`w-full py-2 rounded-lg text-white font-semibold transition duration-200 ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                    >
                        {loading ? "Processing..." : "Pay Now"}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Wrap the PaymentPage component with Elements provider for Stripe
const StripePaymentPage = () => {
    return (
        <Elements stripe={stripePromise}>
            <PaymentPage />
        </Elements>
    );
};

export default StripePaymentPage;