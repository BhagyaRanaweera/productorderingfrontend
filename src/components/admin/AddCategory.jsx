import React, { useState } from "react";
import ApiService from "../../service/ApiService";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await ApiService.createCategory({ name });
            if (response.status === 200) {
                setMessage(response.message);
                setTimeout(() => {
                    setMessage('');
                    navigate("/admin/categories");
                }, 3000);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || "Failed to save a category");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            {message && <p className="text-green-500 text-center mb-4">{message}</p>}
            <form onSubmit={handleSubmit} className="category-form">
                <h2 className="text-2xl font-bold text-center mb-4">Add Category</h2>
                <input
                    type="text"
                    placeholder="Category Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                    Add
                </button>
            </form>
        </div>
    );
};

export default AddCategory;