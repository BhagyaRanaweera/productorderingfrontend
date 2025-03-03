// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Card, CardContent, Divider, Grid, Box, CircularProgress } from "@mui/material";
import ApiService from "../../service/ApiService";
import Pagination from "../common/Pagination";

const ProfilePage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const response = await ApiService.getLoggedInUserInfo();
            setUserInfo(response.user);
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Unable to fetch user info');
        }
    };

    if (!userInfo) {
        return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
    }

    const handleAddressClick = () => {
        navigate(userInfo.address ? '/edit-address' : '/add-address');
    };

    const orderItemList = userInfo.orderItemList || [];
    const totalPages = Math.ceil(orderItemList.length / itemsPerPage);
    const paginatedOrders = orderItemList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <Box sx={{ maxWidth: 800, margin: "auto", padding: 4 }}>
            <Typography variant="h4" gutterBottom>Welcome, {userInfo.name}</Typography>

            {error && <Typography color="error">{error}</Typography>}

            <Card sx={{ marginBottom: 3 }}>
                <CardContent>
                    <Typography variant="h6">User Information</Typography>
                    <Divider sx={{ margin: "16px 0" }} />
                    <Typography><strong>Name:</strong> {userInfo.name}</Typography>
                    <Typography><strong>Email:</strong> {userInfo.email}</Typography>
                    <Typography><strong>Phone Number:</strong> {userInfo.phoneNumber}</Typography>
                </CardContent>
            </Card>

            <Card sx={{ marginBottom: 3 }}>
                <CardContent>
                    <Typography variant="h6">Address</Typography>
                    <Divider sx={{ margin: "16px 0" }} />
                    {userInfo.address ? (
                        <div>
                            <Typography><strong>Street:</strong> {userInfo.address.street}</Typography>
                            <Typography><strong>City:</strong> {userInfo.address.city}</Typography>
                            <Typography><strong>State:</strong> {userInfo.address.state}</Typography>
                            <Typography><strong>Zip Code:</strong> {userInfo.address.zipCode}</Typography>
                            <Typography><strong>Country:</strong> {userInfo.address.country}</Typography>
                        </div>
                    ) : (
                        <Typography>No Address information available</Typography>
                    )}
                    <Button 
                        variant="contained" 
                        color="primary" 
                        sx={{ marginTop: 2 }} 
                        onClick={handleAddressClick}
                    >
                        {userInfo.address ? "Edit Address" : "Add Address"}
                    </Button>
                </CardContent>
            </Card>

            <Card sx={{ marginBottom: 3 }}>
                <CardContent>
                    <Typography variant="h6">Order History</Typography>
                    <Divider sx={{ margin: "16px 0" }} />
                    <Grid container spacing={2}>
                        {paginatedOrders.map(order => (
                            <Grid item xs={12} sm={6} md={4} key={order.id}>
                                <Card>
                                    <CardContent>
                                        <Box display="flex" alignItems="center">
                                            <img 
                                                src={order.product?.imageUrl || "/images/placeholder.png"} 
                                                alt={order.product.name} 
                                                style={{ width: 60, height: 60, objectFit: "cover", borderRadius: "8px", marginRight: 16 }} 
                                            />
                                            <div>
                                                <Typography variant="subtitle1">{order.product.name}</Typography>
                                                <Typography variant="body2" color="textSecondary">Status: {order.status}</Typography>
                                                <Typography variant="body2" color="textSecondary">Quantity: {order.quantity}</Typography>
                                                <Typography variant="body2" color="textSecondary">Price: ${order.price.toFixed(2)}</Typography>
                                            </div>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </CardContent>
            </Card>
        </Box>
    );
};

export default ProfilePage;
