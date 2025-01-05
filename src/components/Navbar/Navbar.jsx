import React, { useState } from "react";
import Logo from "../../assets/logo.png";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import DarkMode from "./DarkMode"; // Assuming you have a DarkMode component
import { NavLink, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";

const Menu = [
  { id: 1, name: "Home", link: "/" },
  { id: 2, name: "Categories", link: "/categories" },
  { id: 3, name: "Cart", link: "/cart" },
];

const Navbar = ({ handleOrderPopup }) => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const isAdmin = ApiService.isAdmin();
  const isAuthenticated = ApiService.isAuthenticated();

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (Menu.some(item => item.name.toLowerCase() === searchValue.toLowerCase())) {
      // If the search matches a category name, navigate to the category page
      const category = Menu.find(item => item.name.toLowerCase() === searchValue.toLowerCase());
      if (category) {
        navigate(`/categories/${category.name.toLowerCase()}`);
      }
    } else {
      // Default search behavior for other searches
      navigate(`/?search=${searchValue}`);
    }
  };

  const handleLogout = () => {
    const confirm = window.confirm("Are you sure you want to logout?");
    if (confirm) {
      ApiService.logout();
      setTimeout(() => {
        navigate('/login');
      }, 500);
    }
  };

  return (
    <div className="shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 relative z-40">
      {/* Upper Navbar */}
      <div className="bg-yellow-500 py-2 dark:bg-yellow-700"> {/* Upper navbar color */}
        <div className="container flex justify-between items-center">
          <div className="flex items-center">
            <img src={Logo} alt="Logo" className="w-10" />
            <span className="font-bold text-2xl sm:text-3xl ml-2">ModishMart</span>
          </div>

          {/* Search Bar */}
          <form className="relative hidden sm:flex" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search"
              value={searchValue}
              onChange={handleSearchChange}
              className="w-[200px] sm:w-[300px] rounded-full border border-gray-300 px-4 py-1 focus:outline-none focus:border-2 focus:border-primary dark:border-gray-500 dark:bg-gray-800"
            />
            <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <IoMdSearch className="text-gray-700" />
            </button>
          </form>

          {/* Order Button */}
          <button
            onClick={handleOrderPopup}
            className="bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3"
          >
            <span className="hidden group-hover:block transition-all duration-200">Order</span>
            <FaCartShopping className="text-xl text-white drop-shadow-sm cursor-pointer" />
          </button>

          {/* Dark Mode Switch */}
          <DarkMode />
        </div>
      </div>

      {/* Lower Navbar */}
      <div className="flex justify-center bg-pink-100 dark:bg-pink-600"> {/* Changed to light pink */}
        <ul className="flex items-center gap-4 py-2">
          {Menu.map((data) => (
            <li key={data.id}>
              <NavLink
                to={data.link}
                className="inline-block px-4 hover:text-primary duration-200"
              >
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
