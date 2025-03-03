import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, List, ListItem, ListItemText, Snackbar, Alert } from "@mui/material";
import Pagination from "../common/Pagination"; // Assuming you have a custom Pagination component
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

    const handleCloseSnackbar = () => {
        setError(null);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            {error && (
                <Snackbar
                    open={Boolean(error)}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%" }}>
                        {error}
                    </Alert>
                </Snackbar>
            )}

            <Typography variant="h4" component="h2" gutterBottom>
                Products
            </Typography>

            <Button 
                variant="contained"
                color="primary"
                onClick={() => navigate('/admin/add-product')}
                sx={{ mb: 2 }}
            >
                Add Product
            </Button>

            <List>
                {products.map((product) => (
                    <ListItem key={product.id} divider>
                        <ListItemText primary={product.name} />
                        <div>
                            <Button 
                                variant="outlined" 
                                color="warning" 
                                sx={{ mr: 2 }}
                                onClick={() => handleEdit(product.id)}
                            >
                                Edit
                            </Button>
                            <Button 
                                variant="outlined" 
                                color="error" 
                                onClick={() => handleDelete(product.id)}
                            >
                                Delete
                            </Button>
                        </div>
                    </ListItem>
                ))}
            </List>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
};

export default AdminProductPage;
