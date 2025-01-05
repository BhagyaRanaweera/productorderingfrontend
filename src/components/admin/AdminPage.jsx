import React from "react";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10 text-center">
            <h1 className="text-3xl font-bold mb-6">Welcome Admin</h1>
            <div className="space-y-4">
                <button 
                    onClick={() => navigate("/admin/categories")} 
                    className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                    Manage Categories
                </button>
                <button 
                    onClick={() => navigate("/admin/products")} 
                    className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                    Manage Products
                </button>
                <button 
                    onClick={() => navigate("/admin/orders")} 
                    className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                    Manage Orders
                </button>
            </div>
        </div>
    );
};

export default AdminPage;