import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Button, Typography, Card, CardContent, Divider, Grid, Box, CircularProgress, 
    Modal, TextField 
} from "@mui/material";
import ApiService from "../../service/ApiService";
import Pagination from "../common/Pagination";

const ProfilePage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const [orderHistory, setOrderHistory] = useState([]);
    const [orderError, setOrderError] = useState(null);
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    
    const navigate = useNavigate();

    // Address Modal State
    const [isAddressModalOpen, setAddressModalOpen] = useState(false);
    const [addressForm, setAddressForm] = useState({
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: ""
    });

    // Fetch user info & order history
    useEffect(() => {
        fetchUserInfo();
        fetchOrderHistory(currentPage);
    }, [currentPage]);

    const fetchUserInfo = async () => {
        try {
            const response = await ApiService.getLoggedInUserInfo();
            setUserInfo(response.user);

            if (response.user.address) {
                setAddressForm(response.user.address);
            }
        } catch (error) {
            setError(error.response?.data?.message || "Unable to fetch user info");
        }
    };

    const fetchOrderHistory = async (page) => {
        try {
            const orders = await ApiService.getUserOrderHistory(page - 1, itemsPerPage);
            setOrderHistory(orders);
        } catch (error) {
            setOrderError(error.response?.data?.message || "Unable to fetch order history");
        }
    };

    const handleOpenAddressModal = () => setAddressModalOpen(true);
    const handleCloseAddressModal = () => setAddressModalOpen(false);

    const handleAddressChange = (e) => {
        setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
    };

    const handleSaveAddress = async () => {
        try {
            const userId = userInfo.id;
            const response = await ApiService.saveAddress(userId, addressForm);
            setUserInfo({ ...userInfo, address: response }); // Update UI with new address
            handleCloseAddressModal();
        } catch (error) {
            setError(error.response?.data?.message || "Failed to save address");
        }
    };

    if (!userInfo) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 800, margin: "auto", padding: 4 }}>
            <Typography variant="h4" gutterBottom>Welcome, {userInfo.name}</Typography>

            {error && <Typography color="error">{error}</Typography>}

            {/* User Information */}
            <Card sx={{ marginBottom: 3 }}>
                <CardContent>
                    <Typography variant="h6">User Information</Typography>
                    <Divider sx={{ margin: "16px 0" }} />
                    <Typography><strong>Name:</strong> {userInfo.name}</Typography>
                    <Typography><strong>Email:</strong> {userInfo.email}</Typography>
                    <Typography><strong>Phone Number:</strong> {userInfo.phoneNumber}</Typography>
                </CardContent>
            </Card>

            {/* Address Section */}
            <Card sx={{ marginBottom: 3 }}>
                <CardContent>
                    <Typography variant="h6">Address</Typography>
                    <Divider sx={{ margin: "16px 0" }} />
                    {userInfo.address ? (
                        <Box>
                            <Typography><strong>Street:</strong> {userInfo.address.street}</Typography>
                            <Typography><strong>City:</strong> {userInfo.address.city}</Typography>
                            <Typography><strong>State:</strong> {userInfo.address.state}</Typography>
                            <Typography><strong>Zip Code:</strong> {userInfo.address.zipCode}</Typography>
                            <Typography><strong>Country:</strong> {userInfo.address.country}</Typography>
                        </Box>
                    ) : (
                        <Typography>No Address information available</Typography>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: 2 }}
                        onClick={handleOpenAddressModal}
                    >
                        {userInfo.address ? "Edit Address" : "Add Address"}
                    </Button>
                </CardContent>
            </Card>

            {/* Order History Section */}
            <Card sx={{ marginBottom: 3 }}>
                <CardContent>
                    <Typography variant="h6">Order History</Typography>
                    <Divider sx={{ margin: "16px 0" }} />

                    {orderError && <Typography color="error">{orderError}</Typography>}

                    <Grid container spacing={2}>
                        {orderHistory.length > 0 ? (
                            orderHistory.map(order => (
                                <Grid item xs={12} sm={6} md={4} key={order.id}>
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" alignItems="center">
                                                <img
                                                    src={order.product?.imageUrl || "/images/placeholder.png"}
                                                    alt={order.product?.name || "Product"}
                                                    style={{ width: 60, height: 60, objectFit: "cover", borderRadius: "8px", marginRight: 16 }}
                                                />
                                                <div>
                                                    <Typography variant="subtitle1">{order.product?.name || "Unknown Product"}</Typography>
                                                    <Typography variant="body2" color="textSecondary">Status: {order.status}</Typography>
                                                    <Typography variant="body2" color="textSecondary">Quantity: {order.quantity}</Typography>
                                                    <Typography variant="body2" color="textSecondary">Price: ${order.price.toFixed(2)}</Typography>
                                                </div>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Typography>No orders found.</Typography>
                        )}
                    </Grid>

                    {/* Pagination Controls */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(orderHistory.length / itemsPerPage)}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </CardContent>
            </Card>

            {/* Address Modal */}
            <Modal open={isAddressModalOpen} onClose={handleCloseAddressModal}>
                <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2
                }}>
                    <Typography variant="h6" gutterBottom>{userInfo.address ? "Edit Address" : "Add Address"}</Typography>
                    <TextField fullWidth label="Street" name="street" value={addressForm.street} onChange={handleAddressChange} sx={{ mb: 2 }} />
                    <TextField fullWidth label="City" name="city" value={addressForm.city} onChange={handleAddressChange} sx={{ mb: 2 }} />
                    <TextField fullWidth label="State" name="state" value={addressForm.state} onChange={handleAddressChange} sx={{ mb: 2 }} />
                    <TextField fullWidth label="Zip Code" name="zipCode" value={addressForm.zipCode} onChange={handleAddressChange} sx={{ mb: 2 }} />
                    <TextField fullWidth label="Country" name="country" value={addressForm.country} onChange={handleAddressChange} sx={{ mb: 2 }} />
                    <Button variant="contained" color="primary" onClick={handleSaveAddress}>Save Address</Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default ProfilePage;
