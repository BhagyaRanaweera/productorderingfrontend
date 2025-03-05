import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { Button, CircularProgress, Snackbar, Alert, Typography, Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const OrderStatus = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];

const AdminOrderDetailsPage = () => {
    const { itemId } = useParams();
    const [orderItems, setOrderItems] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedStatus, setSelectedStatus] = useState({});
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        fetchOrderDetails(itemId);
    }, [itemId]);

    const fetchOrderDetails = async (itemId) => {
        try {
            const response = await ApiService.getOrderItemById(itemId);
            setOrderItems(response.orderItemList);
        } catch (error) {
            setMessage('Failed to fetch order details');
            console.error(error.message || error);
        } finally {
            setLoading(false); // Stop loading when data is fetched or error occurs
        }
    };

    const handleStatusChange = (orderItemId, newStatus) => {
        setSelectedStatus({ ...selectedStatus, [orderItemId]: newStatus });
    };

    const handleSubmitStatusChange = async (orderItemId) => {
        try {
            await ApiService.updateOrderitemStatus(orderItemId, selectedStatus[orderItemId]);
            setMessage('Order item status was successfully updated');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || 'Unable to update order item status');
        }
    };

    return (
        <div className="order-details-page">
            {message && (
                <Snackbar open={Boolean(message)} autoHideDuration={3000} onClose={() => setMessage('')}>
                    <Alert severity="success" sx={{ width: '100%' }}>
                        {message}
                    </Alert>
                </Snackbar>
            )}
            <Typography variant="h4" gutterBottom>Order Details</Typography>
            {loading ? (
                <CircularProgress /> // Show loading indicator while fetching data
            ) : orderItems.length ? (
                orderItems.map((orderItem) => (
                    <Box key={orderItem.id} className="order-item-details" mb={3} p={2} sx={{ border: '1px solid #ddd', borderRadius: '8px' }}>
                        <Box mb={2}>
                            <Typography variant="h6">Order Information</Typography>
                            <Typography><strong>Order Item ID:</strong> {orderItem.id}</Typography>
                            <Typography><strong>Quantity:</strong> {orderItem.quantity}</Typography>
                            <Typography><strong>Total Price:</strong> {orderItem.price}</Typography>
                            <Typography><strong>Order Status:</strong> {orderItem.status}</Typography>
                            <Typography><strong>Date Ordered:</strong> {new Date(orderItem.createdAt).toLocaleDateString()}</Typography>
                        </Box>

                        <Box mb={2}>
                            <Typography variant="h6">User Information</Typography>
                            <Typography><strong>Name:</strong> {orderItem.user?.name || 'N/A'}</Typography>
                            <Typography><strong>Email:</strong> {orderItem.user?.email || 'N/A'}</Typography>
                            <Typography><strong>Phone:</strong> {orderItem.user?.phoneNumber || 'N/A'}</Typography>
                            <Typography><strong>Role:</strong> {orderItem.user?.role || 'N/A'}</Typography>
                        </Box>

                        <Box mb={2}>
                            <Typography variant="h6">Delivery Address</Typography>
                            <Typography><strong>Country:</strong> {orderItem.user?.address?.country || 'N/A'}</Typography>
                            <Typography><strong>State:</strong> {orderItem.user?.address?.state || 'N/A'}</Typography>
                            <Typography><strong>City:</strong> {orderItem.user?.address?.city || 'N/A'}</Typography>
                            <Typography><strong>Street:</strong> {orderItem.user?.address?.street || 'N/A'}</Typography>
                            <Typography><strong>Zip Code:</strong> {orderItem.user?.address?.zipcode || 'N/A'}</Typography>
                        </Box>

                        <Box mb={2}>
                            <Typography variant="h6">Product Information</Typography>
                            <img 
                                src={orderItem.product?.imageUrl || 'default-image-url.jpg'} 
                                alt={orderItem.product?.name || 'Product Name'} 
                                style={{ width: '100px', height: 'auto' }} 
                            />
                            <Typography><strong>Name:</strong> {orderItem.product?.name || 'N/A'}</Typography>
                            <Typography><strong>Description:</strong> {orderItem.product?.description || 'N/A'}</Typography>
                            <Typography><strong>Price:</strong> {orderItem.product?.price || 'N/A'}</Typography>
                        </Box>

                        <Box>
                            <Typography variant="h6">Change Status</Typography>
                            <FormControl fullWidth>
                                <InputLabel>Order Status</InputLabel>
                                <Select
                                    value={selectedStatus[orderItem.id] || orderItem.status}
                                    onChange={(e) => handleStatusChange(orderItem.id, e.target.value)}
                                    label="Order Status"
                                >
                                    {OrderStatus.map(status => (
                                        <MenuItem key={status} value={status}>
                                            {status}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Box mt={2}>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={() => handleSubmitStatusChange(orderItem.id)}
                                >
                                    Update Status
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                ))
            ) : (
                <Typography>No order details available</Typography>
            )}
        </div>
    );
};

export default AdminOrderDetailsPage;
