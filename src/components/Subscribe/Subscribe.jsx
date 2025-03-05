import React, { useState } from "react";
import emailjs from "emailjs-com";
import Banner from "../../assets/website/orange-pattern.jpg";

const BannerImg = {
  backgroundImage: `url(${Banner})`,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: "100%",
  width: "100%",
};

const Subscribe = () => {
  const [email, setEmail] = useState("");

  const handleKeyPress = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission refresh
      sendProductList(email);
      setEmail(""); // Clear the input after submission
    }
  };

  const sendProductList = async (email) => {
    const templateParams = {
      to_email: email,
      message: `Hello,

Thank you for subscribing!

Here is a list of our new products:

1. **Smartphone X** - $799.99  
2. **Wireless Earbuds Pro** - $199.99  
3. **Gaming Laptop 2025** - $1,999.99  
4. **4K Smart TV** - $1,299.99  
5. **Smartwatch Z** - $299.99  

We hope you enjoy shopping with us!

Best regards,  
**ModishMart Team**`,
    };

    try {
      const response = await emailjs.send(
        "service_rc97k2v", // Replace with your EmailJS service ID
        "template_76bnqmj", // Replace with your EmailJS template ID
        templateParams,
        "G74nxxfEV6oL9xdmr" // Replace with your EmailJS public key
      );
      console.log("Email sent successfully:", response);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <div
      data-aos="zoom-in"
      className="mb-20 bg-gray-100 dark:bg-gray-800 text-white"
      style={BannerImg}
    >
      <div className="container backdrop-blur-sm py-10">
        <div className="space-y-6 max-w-xl mx-auto">
          <h1 className="text-2xl !text-center sm:text-left sm:text-4xl font-semibold">
            Get Notified About New Products
          </h1>
          <input
            data-aos="fade-up"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full p-3 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
