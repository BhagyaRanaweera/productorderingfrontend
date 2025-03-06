import axios from "axios";

// Replace with your actual API key
const API_KEY = "AIzaSyAcLIGOTdyyGbmcA63sEovXZGtNATNbSDE";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=${API_KEY}`;

// Predefined FAQ & Coupon Responses
const predefinedResponses = {
  "What are your support contact details?": "📞 Customer Support: +1 800 123 4567\n✉️ Email: support@yourstore.com",
  "How can I get a discount coupon?": "🎉 Use code **SAVE10** for 10% off your next purchase!",
  "How do I report an issue?": "🚨 Please describe your issue, and we'll assist you.",
  "Can I return a product?": "📦 Yes! We offer a 30-day return policy for all products.",
};

const generateResponse = async (question, cartItemCount, cartItemNames, totalPrice, cart) => {
  const lowerCaseQuestion = question.toLowerCase();

  // Predefined responses for common queries
  if (predefinedResponses[question]) {
    return predefinedResponses[question];
  }

  // Cart-related responses
  if (lowerCaseQuestion.includes("cart")) {
    return `You currently have ${cartItemCount} items in your cart: ${cartItemNames}. Total: $${totalPrice.toFixed(2)}.`;
  }

  // Product-related responses (if you have product details stored)
  if (lowerCaseQuestion.includes("product details")) {
    const product = cart.find(item => lowerCaseQuestion.includes(item.name.toLowerCase()));
    if (product) {
      return `The product "${product.name}" has a price of $${product.price}. Quantity: ${product.quantity}.`;
    } else {
      return "Sorry, I couldn't find any product related to your question.";
    }
  }

  // Price-related responses
  if (lowerCaseQuestion.includes("price")) {
    return `The total price of the items in your cart is $${totalPrice.toFixed(2)}.`;
  }

  // General Information
  if (lowerCaseQuestion.includes("products available")) {
    return "We offer a wide variety of products ranging from electronics, fashion, home goods, and more. Check out our catalog for more details!";
  }
  if (lowerCaseQuestion.includes("track my order")) {
    return "You can track your order by visiting the 'My Orders' section in your account. You will find tracking details there.";
  }
  if (lowerCaseQuestion.includes("change my password")) {
    return "To change your password, go to 'Account Settings' and select 'Change Password'. Follow the prompts to update your password.";
  }
  if (lowerCaseQuestion.includes("return policy")) {
    return "You can return products within 30 days of purchase, as long as they are unused and in the original packaging. Please visit the returns page for more details.";
  }

  // Recommendations
  if (lowerCaseQuestion.includes("recommend products")) {
    return "I recommend checking out our top-rated products in electronics, fashion, and home goods! Let me know if you want more specific recommendations.";
  }

  // Reviews and Ratings
  if (lowerCaseQuestion.includes("reviews")) {
    return "The reviews for this product are excellent! Customers have rated it highly for quality and durability.";
  }

  // Order and Payment
  if (lowerCaseQuestion.includes("place an order")) {
    return "To place an order, simply browse our catalog, add items to your cart, and proceed to checkout.";
  }
  if (lowerCaseQuestion.includes("payment methods")) {
    return "We accept various payment methods, including credit/debit cards, PayPal, and Apple Pay.";
  }
  if (lowerCaseQuestion.includes("cancel my order")) {
    return "You can cancel your order within 24 hours of purchase. Please visit the 'My Orders' section to request a cancellation.";
  }

  // If no predefined or cart-related response matches, call Gemini AI
  try {
    const response = await axios.post(GEMINI_URL, {
      prompt: question,
      temperature: 0.7, // You can adjust temperature for response creativity
      max_tokens: 150, // Limit the length of the response
    });

    const geminiResponse = response.data.candidates[0].text;
    return geminiResponse || "I'm sorry, I didn't understand your question. Could you please clarify or ask something else?";
  } catch (error) {
    console.error("Error calling Gemini API", error);
    return "I'm sorry, there was an error processing your request. Please try again later.";
  }
};

export default generateResponse;
