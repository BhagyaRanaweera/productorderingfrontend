import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from './components/context/CartContext';
import { ProtectedRoute, AdminRoute } from './service/Guard';
import Navbar from './components/Navbar/Navbar';

import Hero from './components/Hero/Hero';
import ProductDetailsPage from './components/pages/ProductDetailsPage';
import CategoryListPage from './components/pages/CategoryListPage';
import CategoryProductsPage from './components/pages/CategoryProductsPage';
import CartPage from './components/pages/Cart';
import RegisterPage from './components/pages/RegisterPage';
import LoginPage from './components/pages/LoginPage';
import ProfilePage from './components/pages/ProfilePage';
import AddressPage from './components/pages/AddressPage';
import AdminPage from './components/admin/AdminPage';
import StripePaymentPage from './components/pages/PaymentPage';
import ConfirmationPage from './components/pages/ConfirmationPage';
import AOS from "aos";
import "aos/dist/aos.css";

import Popup from "./components/Popup/Popup";

const App = () => {
  const [orderPopup, setOrderPopup] = React.useState(false);

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
      <Router>
        <CartProvider>
          <Navbar handleOrderPopup={handleOrderPopup} />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Hero />} />
            <Route path="/product/:productId" element={<ProductDetailsPage />} />
            <Route path="/categories" element={<CategoryListPage />} />
            <Route path="/category/:categoryId" element={<CategoryProductsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/payment" element={<StripePaymentPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
            <Route path="/add-address" element={<ProtectedRoute element={<AddressPage />} />} />
            <Route path="/edit-address" element={<ProtectedRoute element={<AddressPage />} />} />

            {/* Admin Routes - All managed inside AdminPage */}
            <Route path="/admin/*" element={<AdminRoute element={<AdminPage />} />} />
          </Routes>

          {/* Order Confirmation Popup */}
          <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
        </CartProvider>
      </Router>
    </div>
  );
};

export default App;
