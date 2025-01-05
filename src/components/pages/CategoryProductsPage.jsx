import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../../service/ApiService";
import ProductList from "../common/ProductList";
import Pagination from "../common/Pagination";

const CategoryProductsPage = () => {
    const { categoryId } = useParams();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState(null);
    const itemsPerPage = 8;

    useEffect(() => {
        fetchProducts();
    }, [categoryId, currentPage]);

    const fetchProducts = async () => {
        try {
            console.log(`Fetching products for category ID: ${categoryId}`);
            const response = await ApiService.getProductsByCategory(categoryId);
            console.log('API Response:', response);
            
            const allProducts = response.productList || [];
            console.log('All Products:', allProducts);
            
            setTotalPages(response.totalPage);
            setProducts(allProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
        } catch (err) {
            console.error('Error fetching products:', err);
            setError("Unable to fetch products. Please try again later.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            {error && <p className="text-red-500 text-center">{error}</p>}
            <ProductList products={products} />
            {products.length === 0 && !error && <p className="text-center text-gray-500">No products found for this category.</p>}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            )}
        </div>
    );
}

export default CategoryProductsPage;