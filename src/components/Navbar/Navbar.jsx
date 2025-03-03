import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import DarkMode from "./DarkMode";
import ApiService from "../../service/ApiService";
import LanguageSelector from "../common/LanguageSelector";
import { useCart } from "../context/CartContext"; // Import useCart context
import Logo from "../../assets/logo.png";

const Menu = [
  { id: 1, name: "Home", link: "/" },
  { id: 2, name: "Categories", link: "/categories" },
  { id: 3, name: "Cart", link: "/cart" },
];

const Navbar = ( ) => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const isAdmin = ApiService.isAdmin();
  const isAuthenticated = ApiService.isAuthenticated();
  const { cart } = useCart(); // Access cart context
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0); // Count total items in cart

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (Menu.some((item) => item.name.toLowerCase() === searchValue.toLowerCase())) {
      const category = Menu.find((item) => item.name.toLowerCase() === searchValue.toLowerCase());
      if (category) {
        navigate(`/categories/${category.name.toLowerCase()}`);
      }
    } else {
      navigate(`/?search=${searchValue}`);
    }
  };

  const handleLogout = () => {
    const confirm = window.confirm("Are you sure you want to logout?");
    if (confirm) {
      ApiService.logout();
      setTimeout(() => {
        navigate("/login");
      }, 500);
    }
  };

  return (
    <div className="shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 relative z-40">
      {/* Upper Navbar */}
      <div className="bg-primary/40 py-2">
        <div className="container flex justify-between items-center">
          <div className="flex items-center">
            <NavLink to="/">
              <img src={Logo} alt="Logo" className="w-10" />
            </NavLink>
            <span className="font-bold text-2xl sm:text-3xl ml-2">ModishMart</span>
          </div>

          {/* Search Bar and Cart Button */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <div className="relative group hidden sm:block">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchValue}
                  onChange={handleSearchChange}
                  className="w-[200px] sm:w-[300px] transition-all duration-300 rounded-full border border-gray-300 px-2 py-1 focus:outline-none focus:border-1 focus:border-primary dark:border-gray-500 dark:bg-gray-800"
                />
                <IoMdSearch className="text-gray-500 group-hover:text-primary absolute top-1/2 -translate-y-1/2 right-3" />
              </div>

              
            </form>

            {/* Cart Icon with Counter */}
            <NavLink to="/cart" className="relative">
              <FaCartShopping className="text-2xl text-gray-700 dark:text-white" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </NavLink>

            {/* Dark Mode Switch */}
            <DarkMode />

            {/* Language Selector */}
            <LanguageSelector />
          </div>
        </div>
      </div>

      {/* Lower Navbar */}
      <div data-aos="zoom-in" className="flex justify-center">
        <ul className="sm:flex hidden items-center gap-4">
          {Menu.map((data) => (
            <li key={data.id}>
              <NavLink to={data.link} className="inline-block px-4 hover:text-primary duration-200">
                {data.name}
              </NavLink>
            </li>
          ))}
          {isAuthenticated && (
            <li>
              <NavLink to="/profile" className="inline-block px-4 hover:text-primary duration-200">
                My Account
              </NavLink>
            </li>
          )}
          {isAdmin && (
            <li>
              <NavLink to="/admin" className="inline-block px-4 hover:text-primary duration-200">
                Admin
              </NavLink>
            </li>
          )}
          {!isAuthenticated && (
            <li>
              <NavLink to="/login" className="inline-block px-4 hover:text-primary duration-200">
                Login
              </NavLink>
            </li>
          )}
          {isAuthenticated && (
            <li>
              <NavLink onClick={handleLogout} className="inline-block px-4 hover:text-primary duration-200">
                Logout
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
