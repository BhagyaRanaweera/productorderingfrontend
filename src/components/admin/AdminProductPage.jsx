import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../common/Pagination";
import ApiService from "../../service/ApiService";

const AdminProductPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState(null);
    const itemsPerPage = 10;

    const fetchProducts = async () => {
        try {
            const response = await ApiService.getAllProducts();
            const productList = response.productList || [];
            setTotalPages(Math.ceil(productList.length / itemsPerPage));
            setProducts(productList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Unable to fetch products');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [currentPage]);

    const handleEdit = async (id) => {
        navigate(`/admin/edit-product/${id}`);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this product?");
        if (confirmed) {
            try {
                await ApiService.deleteProduct(id);
                fetchProducts();
            } catch (error) {
                setError(error.response?.data?.message || error.message || 'Unable to delete product');
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            {error ? (
                <p className="text-red-500 mb-4">{error}</p>
            ) : (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Products</h2>
                    <button 
                        className="mb-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200" 
                        onClick={() => { navigate('/admin/add-product'); }}
                    >
                        Add Product
                    </button>
                    <ul className="space-y-2">
                        {products.map((product) => (
                            <li key={product.id} className="flex justify-between items-center border-b py-2">
                                <span className="text-lg">{product.name}</span>
                                <div className="space-x-2">
                                    <button 
                                        className="bg-yellow-500 text-white font-semibold py-1 px-3 rounded-lg hover:bg-yellow-600 transition duration-200" 
                                        onClick={() => handleEdit(product.id)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="bg-red-500 text-white font-semibold py-1 px-3 rounded-lg hover:bg-red-600 transition duration-200" 
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            )}
        </div>
    );
};

export default AdminProductPage;