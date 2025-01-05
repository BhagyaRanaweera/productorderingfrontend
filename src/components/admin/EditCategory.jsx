import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const EditCategory = () => {
    const { categoryId } = useParams();
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategory(categoryId);
    }, [categoryId]);

    const fetchCategory = async () => {
        try {
            const response = await ApiService.getCategoryById(categoryId);
            setName(response.category.name);
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || "Failed to get a category by id");
            setTimeout(() => {
                setMessage('');
            }, 3000);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await ApiService.updateCategory(categoryId, { name });
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
            {message && <p className="text-green-500 mb-4">{message}</p>}
            <form onSubmit={handleSubmit} className="category-form">
                <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
                <input 
                    type="text"
                    placeholder="Category Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)} 
                    className="border border-gray-300 rounded-md p-2 w-full mb-4"
                    required
                />
                <button 
                    type="submit" 
                    className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                    Update
                </button>
            </form>
        </div>
    );
};

export default EditCategory;