import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { Button, CircularProgress, TextField, Snackbar, Alert, Typography, Box } from "@mui/material";

const OrderStatus = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];

const AdminOrderDetailsPage = () => {
    const { itemId } = useParams();
    const [orderItems, setOrderItems] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedStatus, setSelectedStatus] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOrderDetails(itemId);
    }, [itemId]);

    const fetchOrderDetails = async (itemId) => {
        setLoading(true);
        try {
            const response = await ApiService.getOrderItemById(itemId);
            setOrderItems(response.orderItemList);
        } catch (error) {
            console.log(error.message || error);
            setMessage('Error fetching order details');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (orderItemId, newStatus) => {
        setSelectedStatus({ ...selectedStatus, [orderItemId]: newStatus });
    };

    const handleSubmitStatusChange = async (orderItemId) => {
        try {
            await ApiService.updateOrderitemStatus(orderItemId, selectedStatus[orderItemId]);
            setMessage('Order item status was successfully updated');
            setTimeout(() => {
                setMessage('');
            }, 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || 'Unable to update order item status');
        }
    };

    const handleCloseSnackbar = () => {
        setMessage('');
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
            {/* Snackbar for Error and Success */}
            {message && (
                <Snackbar open={true} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={message.includes('Error') ? "error" : "success"} sx={{ width: "100%" }}>
                        {message}
                    </Alert>
                </Snackbar>
            )}

            <Typography variant="h4" component="h2" gutterBottom>
                Order Details
            </Typography>

            {/* Loading Spinner */}
            {loading ? (
                <div className="flex justify-center">
                    <CircularProgress />
                </div>
            ) : orderItems.length ? (
                orderItems.map((orderItem) => (
                    <Box key={orderItem.id} sx={{ mb: 6, borderBottom: '1px solid #e0e0e0', pb: 4 }}>
                        {/* Order Information */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" component="h3" gutterBottom>
                                Order Information
                            </Typography>
                            <Typography><strong>Order Item ID:</strong> {orderItem.id}</Typography>
                            <Typography><strong>Quantity:</strong> {orderItem.quantity}</Typography>
                            <Typography><strong>Total Price:</strong> ${orderItem.price.toFixed(2)}</Typography>
                            <Typography><strong>Order Status:</strong> {orderItem.status}</Typography>
                            <Typography><strong>Date Ordered:</strong> {new Date(orderItem.createdAt).toLocaleDateString()}</Typography>
                        </Box>

                        {/* User Information */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" component="h3" gutterBottom>
                                User Information
                            </Typography>
                            <Typography><strong>Name:</strong> {orderItem.user.name}</Typography>
                            <Typography><strong>Email:</strong> {orderItem.user.email}</Typography>
                            <Typography><strong>Phone:</strong> {orderItem.user.phoneNumber}</Typography>
                            <Typography><strong>Role:</strong> {orderItem.user.role}</Typography>
                        </Box>

                        {/* Delivery Address */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" component="h3" gutterBottom>
                                Delivery Address
                            </Typography>
                            <Typography><strong>Country:</strong> {orderItem.user.address?.country}</Typography>
                            <Typography><strong>State:</strong> {orderItem.user.address?.state}</Typography>
                            <Typography><strong>City:</strong> {orderItem.user.address?.city}</Typography>
                            <Typography><strong>Street:</strong> {orderItem.user.address?.street}</Typography>
                            <Typography><strong>Zip Code:</strong> {orderItem.user.address?.zipcode}</Typography>
                        </Box>

                        {/* Product Information */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" component="h3" gutterBottom>
                                Product Information
                            </Typography>
                            <img src={orderItem.product.imageUrl} alt={orderItem.product.name} style={{ width: 200, height: 200, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} />
                            <Typography><strong>Name:</strong> {orderItem.product.name}</Typography>
                            <Typography><strong>Description:</strong> {orderItem.product.description}</Typography>
                            <Typography><strong>Price:</strong> ${orderItem.product.price.toFixed(2)}</Typography>
                        </Box>

                        {/* Status Change */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" component="h4" gutterBottom>
                                Change Status
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <TextField
                                    select
                                    label="Order Status"
                                    value={selectedStatus[orderItem.id] || orderItem.status}
                                    onChange={(e) => handleStatusChange(orderItem.id, e.target.value)}
                                    fullWidth
                                    SelectProps={{
                                        native: true,
                                    }}
                                >
                                    {OrderStatus.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </TextField>
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
                <Typography color="textSecondary">No order details available.</Typography>
            )}
        </div>
    );
};

export default AdminOrderDetailsPage;
