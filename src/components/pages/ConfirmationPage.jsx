import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser"; // Ensure correct import

const ConfirmationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { paymentInfo, email } = location.state || {}; // Retrieve payment info and email

    // Function to send confirmation email
    const sendConfirmationEmail = async () => {
        if (!email) {
            console.error("Error: Email is missing");
            return;
        }

        const templateParams = {
            to_email: email, // Recipient's email
            message: `Hello,

Thank you for your order!

Your payment was successful.

We appreciate your business!

Best regards,
ModishMart Team`,
        };

        try {
            const response = await emailjs.send(
                "service_rc97k2v", // Your EmailJS service ID
                "template_4qpyrqd", // Your EmailJS template ID
                templateParams, // Template parameters
                "G74nxxfEV6oL9xdmr" // Your EmailJS public key
            );
            console.log("Email sent successfully:", response);
        } catch (error) {
            console.error("Error sending email:", error);
        }
    };

    // Send email when the page loads
    useEffect(() => {
        sendConfirmationEmail();
    }, [email]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
                <h1 className="text-2xl font-bold text-center text-green-600">Order Confirmed!</h1>
                <p className="mt-2 text-center text-gray-700">Thank you for your order. Your payment was successful.</p>
                
                {paymentInfo && (
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold">Payment Details:</h2>
                        <p className="text-gray-600">Transaction ID: <span className="font-medium">{paymentInfo.transactionId}</span></p>
                        <p className="text-gray-600">Amount: <span className="font-medium">${paymentInfo.amount}</span></p>
                        <p className="text-gray-600">Date: <span className="font-medium">{new Date(paymentInfo.date).toLocaleString()}</span></p>
                    </div>
                )}

                <div className="mt-6">
                    <button 
                        onClick={() => navigate("/cart")} 
                        className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        Back to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPage;
