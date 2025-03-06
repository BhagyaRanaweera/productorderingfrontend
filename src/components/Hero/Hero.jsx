import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductList from "../common/ProductList";
import Pagination from "../common/Pagination";
import ApiService from "../../service/ApiService";
import Slider from "react-slick";
import Image1 from "../../assets/hero/women.png";
import Image2 from "../../assets/hero/shopping.png";
import Image3 from "../../assets/hero/sale.png";
import CountdownTimer from "../common/CountdownTimer";
import Banner from "../Banner/Banner";
import Subscribe from "../Subscribe/Subscribe";
import Testimonials from "../Testimonials/Testimonials";
import Footer from "../Footer/Footer";
import { useCart } from "../context/CartContext"; // Import cart context
import { FaRobot } from "react-icons/fa";
import BrandIcons from "../common/BrandIcons"; 

const ImageList = [
  { id: 1, img: Image1, title: "Upto 50% off on all Men's Wear", description: "Good things come to those who shop!" },
  { id: 2, img: Image2, title: "30% off on all Women's Wear", description: "Success in retail is all about the little things." },
  { id: 3, img: Image3, title: "70% off on all Products Sale", description: "Find your happy place in our aisles!" },
];

// Hero Section
const Hero = ({ handleOrderPopup }) => {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  return (
    <div className="relative overflow-hidden min-h-[550px] sm:min-h-[650px] bg-gray-100 flex justify-center items-center dark:bg-gray-950 dark:text-gray-300 duration-200">
      <div className="h-[700px] w-[700px] bg-primary/40 absolute -top-1/2 right-0 rounded-3xl rotate-45 -z[8]"></div>
      <div className="container pb-8 sm:pb-0">
        <Slider {...settings}>
          {ImageList.map((data) => (
            <div key={data.id}>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1 relative z-10 dark:text-white">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold dark:text-gray-100">{data.title}</h1>
                  <p className="text-sm dark:text-gray-300">{data.description}</p>
                  <div>
                    <button
                      onClick={handleOrderPopup}
                      className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-2 px-4 rounded-full"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
                <div className="order-1 sm:order-2">
                  <img src={data.img} alt="" className="w-[300px] h-[300px] sm:h-[450px] sm:w-[450px] sm:scale-105 lg:scale-120 object-contain mx-auto" />
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

// Home Component
const Home = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;
  const { cart } = useCart(); // Get cart data
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0); 
  const cartItemNames = cart.map(item => item.name).join(', ');
  const totalPrice = cart.reduce((total, item) => total + item.quantity * item.price, 0);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [userQuestion, setUserQuestion] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let allProducts = [];
        const queryparams = new URLSearchParams(location.search);
        const searchItem = queryparams.get("search");

        if (searchItem) {
          const response = await ApiService.searchProducts(searchItem);
          allProducts = response.productList || [];
        } else {
          const response = await ApiService.getAllProducts();
          allProducts = response.productList || [];
        }

        setTotalPages(Math.ceil(allProducts.length / itemsPerPage));
        setProducts(allProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
      } catch (error) {
        setError(error.response?.data?.message || error.message || "Unable to fetch products");
      }
    };

    fetchProducts();
  }, [location.search, currentPage]);

  

const handleOrderPopup = () => {
  // Filter products with price greater than 100
  const filteredProducts = products.filter(product => product.price > 100);

  if (filteredProducts.length === 0) {
    alert("No products above $100 available for discount.");
    return;
  }

  // Calculate discounted price
  const totalOriginalPrice = filteredProducts.reduce((total, product) => total + product.price, 0);
  const discount = totalOriginalPrice * 0.3; // 30% discount
  const totalAfterDiscount = totalOriginalPrice - discount;

  // Display the result
  alert(
    `Products eligible for discount:\n${filteredProducts.map(p => `${p.name} - $${p.price.toFixed(2)}`).join("\n")}
    \nTotal Price: $${totalOriginalPrice.toFixed(2)}
    \nDiscount (30%): -$${discount.toFixed(2)}
    \nTotal After Discount: $${totalAfterDiscount.toFixed(2)}`
  );

  // Navigate to the Cart page
  
};

  // Function to generate real-time responses based on the user's question
  const generateResponse = (question) => {
    let response = "";

    // Cart-related responses
    if (question.toLowerCase().includes("cart")) {
      response = `You currently have ${cartItemCount} items in your cart: ${cartItemNames}. Total: $${totalPrice.toFixed(2)}.`;
    }
    // Product-related responses
    else if (question.toLowerCase().includes("product details")) {
      const product = cart.find(item => question.toLowerCase().includes(item.name.toLowerCase()));
      if (product) {
        response = `The product "${product.name}" has a price of $${product.price}. Quantity: ${product.quantity}.`;
      } else {
        response = "Sorry, I couldn't find any product related to your question.";
      }
    }
    // Price-related responses
    else if (question.toLowerCase().includes("price")) {
      response = `The total price of the items in your cart is $${totalPrice.toFixed(2)}.`;
    }
    // General responses
    else if (question.toLowerCase().includes("reviews")) {
      response = "The reviews for this product are great! Customers love the quality.";
    } else {
      response = "Sorry, I didn't understand your question. Could you please clarify?";
    }

    return response;
  };

  const handleAskQuestion = () => {
    const response = generateResponse(userQuestion);
    
    // Update chat history with the user's question and chatbot's response
    setChatHistory([
      ...chatHistory,
      { user: userQuestion, chatbot: response },
    ]);

    setUserQuestion(""); // Clear the input after sending
  };

  var saleEndTime = "2025-02-01T00:00:00Z";

  return (
    <div className="home dark:text-gray-300">
      <Hero handleOrderPopup={handleOrderPopup} />
     {/* Add BrandIcons Component */}
     <BrandIcons />
      
      {error ? (
        <p className="error-message dark:text-red-400">{error}</p>
      ) : (
        <div>
          <ProductList products={products} />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
        </div>
      )}

      <Banner />
      <Subscribe />
      <CountdownTimer saleEndTime={saleEndTime} />
      <Testimonials />
      <Footer />

      {/* Chatbot Icon */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg"
      >
        <FaRobot className="text-2xl" />
      </button>

      {/* Chatbot Popup */}
      {chatOpen && (
        <div className="fixed bottom-16 right-6 bg-white dark:bg-gray-800 shadow-lg p-4 w-72 rounded-lg">
          <h2 className="text-lg font-bold dark:text-white">Gemini Chatbot</h2>
          <p className="text-sm dark:text-gray-300">Hello! How can I assist you?</p>

          {/* Display Chat History */}
          <div className="chat-history max-h-60 overflow-y-auto">
            {chatHistory.map((message, index) => (
              <div key={index} className="message">
                {message.user && <div className="user-message">{message.user}</div>}
                {message.chatbot && <div className="chatbot-message">{message.chatbot}</div>}
              </div>
            ))}
          </div>

          {/* User Input */}
          <div className="chat-input">
            <input
              type="text"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              placeholder="Ask me anything..."
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleAskQuestion}
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded"
            >
              Ask
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setChatOpen(false)}
            className="mt-4 text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
