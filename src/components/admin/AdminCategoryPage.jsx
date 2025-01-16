import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import { useNavigate } from "react-router-dom";

const AdminCategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await ApiService.getAllCategory();
            setCategories(response.categoryList || []);
        } catch (error) {
            console.log("Error fetching category list", error);
        }
    };

    const handleEdit = async (id) => {
        navigate(`/admin/edit-category/${id}`);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this category?");
        if (confirmed) {
            try {
                // Call the API to delete the category
                await ApiService.deleteCategory(id);
                fetchCategories();  // Refresh the category list after deletion
            } catch (error) {
                console.log("Error deleting category by id", error);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-4">Categories</h2>
            <button 
                onClick={() => navigate('/admin/add-category')} 
                className="mb-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
            >
                Add Category
            </button>
            <ul className="space-y-2">
                {categories.map((category) => (
                    <li key={category.id} className="flex justify-between items-center border-b py-2">
                        <span className="text-lg">{category.name}</span>
                        <div className="space-x-2">
                            <button 
                                className="bg-yellow-500 text-white font-semibold py-1 px-3 rounded-lg hover:bg-yellow-600 transition duration-200" 
                                onClick={() => handleEdit(category.id)}
                            >
                                Edit
                            </button>
                            <button 
                                className="bg-red-500 text-white font-semibold py-1 px-3 rounded-lg hover:bg-red-600 transition duration-200" 
                                onClick={() => handleDelete(category.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminCategoryPage;
