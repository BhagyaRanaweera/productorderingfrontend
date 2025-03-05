import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { useCart } from "../context/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Box, Typography, Button, Paper, CircularProgress, Alert, TextField } from "@mui/material";
import emailjs from "emailjs-com";
emailjs.init("G74nxxfEV6oL9xdmr");

const stripePromise = loadStripe("pk_test_51QH4Q1HpZQPWXTXAXpo9UcLoTgK7CgQX7Z4XiCNmMEPUYpLAKiNsFjQdIIfDQFFhP2KFDpAkw1h28OnOKvsMcfsi00nKtw7M0j");

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cart } = useCart();
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const totalPrice = Number(location.state?.totalPrice) || 0;

    const sendEmailConfirmation = async () => {
        const templateParams = {
            message: `Hello,\n\nThank you for your order!\n\nYour payment was successful.\n\nWe appreciate your business!\n\nBest regards,\nModishMart Team`,
        };

        try {
            await emailjs.send("service_rc97k2v", "template_4qpyrqd", templateParams);
            console.log("Email sent successfully!");
        } catch (error) {
            console.error("Error sending email:", error);
        }
    };

    const handlePayment = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);

        const cardNumberElement = elements.getElement(CardNumberElement);
        const cardExpiryElement = elements.getElement(CardExpiryElement);
        const cardCvcElement = elements.getElement(CardCvcElement);

        try {
            const paymentMethod = await stripe.createPaymentMethod({
                type: "card",
                card: cardNumberElement,
            });

            if (paymentMethod.error) {
                setErrorMessage(paymentMethod.error.message);
                setLoading(false);
                return;
            }

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
                await sendEmailConfirmation();
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
        <Box className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-6">
            <Paper elevation={4} className="p-8 max-w-md w-full shadow-lg rounded-lg bg-white bg-opacity-50 backdrop-blur-md">
                <Typography variant="h5" className="font-bold text-center text-xl mb-6">
                    Payment
                </Typography>

                {errorMessage && (
                    <Alert severity="error" className="mb-4">
                        {errorMessage}
                    </Alert>
                )}

                <form onSubmit={handlePayment} className="w-full">
                    <Box className="mb-4">
                        <Typography className="mb-2">Card Number</Typography>
                        <CardNumberElement className="border p-4 rounded w-full bg-white bg-opacity-50 backdrop-blur-md" />
                    </Box>

                    <Box className="mb-4">
                        <Typography className="mb-2">Expiry Date</Typography>
                        <CardExpiryElement className="border p-4 rounded w-full bg-white bg-opacity-50 backdrop-blur-md" />
                    </Box>

                    <Box className="mb-4">
                        <Typography className="mb-2">CVC</Typography>
                        <CardCvcElement className="border p-4 rounded w-full bg-white bg-opacity-50 backdrop-blur-md" />
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading || !stripe}
                        className="py-3 mt-4"
                    >
                        {loading ? <CircularProgress size={24} /> : "Pay Now"}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

const StripePaymentPage = () => {
    return (
        <Elements stripe={stripePromise}>
            <PaymentPage />
        </Elements>
    );
};

export default StripePaymentPage;