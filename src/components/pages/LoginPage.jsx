import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import img from '../../assets/cover.jpg';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData); // Debugging
    try {
      const response = await ApiService.loginUser(formData);
      console.log("API Response:", response); // Debugging
      if (response.status === 200) {
        setMessage("User Successfully Logged in");
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        setTimeout(() => {
          navigate("/profile");
        }, 4000);
      }
    } catch (error) {
      console.error("Login Error:", error); // Debugging
      setMessage(error.response?.data.message || error.message || "Unable to login a user");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 flex items-center justify-center p-6">
      <div className="flex justify-center items-center w-full max-w-4xl bg-white shadow-2xl rounded-lg">
        <img className="w-1/2 hidden lg:block rounded-l-lg" src={img} alt="Login illustration" />
        <div className="w-full lg:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Login</h2>
          {message && (
            <p className={`text-center mb-4 ${message.includes("Successfully") ? "text-green-500" : "text-red-500"}`}>
              {message}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ---- Input Email ---- */}
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
                Your Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            {/* ---- Input Password ---- */}
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="password">
                Your Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Your Password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-500 text-white font-bold rounded-lg shadow-md hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 transition duration-300"
            >
              Login
            </button>
          </form>
          <p className="text-gray-700 mt-4 text-center">
            Don't have an account?{" "}
            <a href="/register" className="text-indigo-500 font-medium hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
