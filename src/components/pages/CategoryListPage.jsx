import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";

const CategoryListPage = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await ApiService.getAllCategory();
            setCategories(response.categoryList || []);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Unable to fetch categories');
        }
    };

    const handleCategoryClick = (categoryId) => {
        navigate(`/category/${categoryId}`);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            {error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : (
                <div>
                    <h2 className="text-2xl font-bold text-center mb-4">Categories</h2>
                    <ul className="space-y-2">
                        {categories.map((category) => (
                            <li key={category.id}>
                                <button
                                    onClick={() => handleCategoryClick(category.id)}
                                    className="w-full text-left p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                                >
                                    {category.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CategoryListPage;