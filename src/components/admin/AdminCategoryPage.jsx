import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService"; // Ensure this service has the necessary methods
import { useNavigate } from "react-router-dom";

const AdminCategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryName, setCategoryName] = useState('');
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

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setCategoryName(category.name);
    };

    const handleUpdate = async () => {
        if (!selectedCategory) return;

        try {
            await ApiService.updateCategory(selectedCategory.id, { name: categoryName });
            fetchCategories(); // Refresh the list
            setSelectedCategory(null);
            setCategoryName('');
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const handleDelete = async (categoryId) => {
        try {
            await ApiService.deleteCategory(categoryId);
            fetchCategories(); // Refresh the list
        } catch (error) {
            console.error('Error deleting category:', error);
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
                                onClick={() => handleEdit(category)}
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

            {selectedCategory && (
                <div className="mt-6">
                    <h3 className="text-xl font-semibold">Edit Category</h3>
                    <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className="border rounded-lg p-2 w-full"
                    />
                    <button 
                        onClick={handleUpdate}
                        className="mt-2 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
                    >
                        Update Category
                    </button>
                    <button 
                        onClick={() => {
                            setSelectedCategory(null);
                            setCategoryName('');
                        }}
                        className="mt-2 ml-2 bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminCategoryPage;