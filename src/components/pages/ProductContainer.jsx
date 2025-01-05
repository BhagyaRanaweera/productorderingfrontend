import React, { useEffect, useState } from 'react';
import ApiService from '../../service/ApiService'; // Adjust the import based on your file structure
import ProductList from '../common/ProductList'; // Adjust the import based on your file structure

const ProductContainer = ({ categoryId, itemsPerPage }) => {
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState('');

    const fetchProducts = async () => {
        try {
            const response = await ApiService.getProductsByCategory(categoryId);
            const allProducts = response.productList || [];
            setTotalPages(response.totalPage);
            setProducts(allProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
        } catch (err) {
            console.error('Error fetching products:', err);
            setError("Unable to fetch products. Please try again later.");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [categoryId, currentPage]);

    return (
        <div>
            {error && <p>{error}</p>}
            <ProductList products={products} />
            {/* Add pagination controls here if needed */}
        </div>
    );
};

export default ProductContainer;