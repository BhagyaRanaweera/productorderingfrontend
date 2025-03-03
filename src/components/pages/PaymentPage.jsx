import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { useCart } from "../context/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Box, Typography, Button, Paper, CircularProgress, Alert } from "@mui/material";

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
    const totalPrice = Number(location.state?.totalPrice) || 0;

    const handlePayment = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);

        const cardElement = elements.getElement(CardElement);

        try {
            const paymentMethod = await stripe.createPaymentMethod({
                type: "card",
                card: cardElement,
            });

            if (paymentMethod.error) {
                setErrorMessage(paymentMethod.error.message);
                setLoading(false);
                return;
            }

            // Prepare order items for the API
            const orderItems = cart.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
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
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            bgcolor="#f5f5f5"
            p={2}
        >
            <Paper elevation={4} sx={{ p: 4, maxWidth: 400, width: "100%", textAlign: "center" }}>
                <Typography variant="h5" fontWeight="bold">
                    Payment
                </Typography>
                

                {errorMessage && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {errorMessage}
                    </Alert>
                )}

                <form onSubmit={handlePayment} style={{ marginTop: 20 }}>
                    <Box border="1px solid #ccc" borderRadius="5px" p={2} mb={3}>
                        <CardElement />
                    </Box>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading || !stripe}
                        sx={{ py: 1.5 }}
                    >
                        {loading ? <CircularProgress size={24} /> : "Pay Now"}
                    </Button>
                </form>
            </Paper>
        </Box>
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
