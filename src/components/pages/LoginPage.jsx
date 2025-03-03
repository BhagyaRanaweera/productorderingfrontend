import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApiService from "../../service/ApiService";
import img from "../../assets/cover.jpg";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  // Validation Function
  const validate = () => {
    let tempErrors = {};
    if (!formData.email) {
      tempErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Invalid email format.";
    }
    if (!formData.password) {
      tempErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await ApiService.loginUser(formData);
      if (response.status === 200) {
        setMessage({ type: "success", text: "Login successful!" });
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.role);
        setTimeout(() => navigate("/"), 3000);
      }
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Login failed." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white-900 to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-3xl bg-opacity-30 bg-white backdrop-blur-md rounded-2xl shadow-2xl p-8 flex items-center"
      >
        {/* Left Image Section */}
        <div className="hidden md:block w-1/2">
          <img src={img} alt="Login Art" className="rounded-xl w-full h-auto" />
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-3xl font-extrabold text-white text-center mb-4">Welcome Back</h2>
          {message && (
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`text-center mb-4 p-2 rounded-lg text-sm ${
                message.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {message.text}
            </motion.p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full p-3 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 text-black"
                required
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full p-3 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 text-black"
                required
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full p-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition duration-300"
            >
              Login
            </motion.button>
          </form>

          {/* Register & Forgot Password */}
          <p className="text-gray-500 mt-4 text-center">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-400 font-medium hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
