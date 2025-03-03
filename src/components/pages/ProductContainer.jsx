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
            setError('Unable to fetch products. Please try again later.');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [categoryId, currentPage]);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div>
            {error && <p>{error}</p>}
            <ProductList products={products} />

            {/* Pagination controls */}
            <div className="mt-4 flex justify-center items-center">
                <button
                    onClick={handlePrev}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-l-lg"
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                
                {/* Page numbers */}
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToPage(index + 1)}
                        className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-lg mx-1`}
                    >
                        {index + 1}
                    </button>
                ))}

                <button
                    onClick={handleNext}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-lg"
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ProductContainer;
