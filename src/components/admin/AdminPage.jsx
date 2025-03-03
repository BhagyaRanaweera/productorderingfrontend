import React from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { Button, Card, CardContent, Typography, Grid } from "@mui/material";
import { Dashboard, Category, ShoppingCart, CalendarToday, People, Reviews, BarChart } from "@mui/icons-material";
import AdminCategoryPage from "./AdminCategoryPage";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import AdminProductPage from "./AdminProductPage";
import AddProductPage from "./AddProductPage";
import EditProductPage from "./EditProductPage";
import AdminOrdersPage from "./AdminOrderPage";
import AdminOrderDetailsPage from "./AdminOrderDetailsPage";
import AdminCalendarPage from "./AdminCalendarPage";
import AdminEmployeePage from "./AdminEmployeePage";
import AdminReviewPage from "./AdminReviewPage";
import AdminAnalyticsPage from "./AdminAnalyticsPage";

const AdminPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-1/4 bg-gray-800 text-white p-6">
                <Typography variant="h5" className="font-bold mb-6 flex items-center">
                    <Dashboard className="mr-2" /> Admin Panel
                </Typography>
                <div className="space-y-4">
                    <Button fullWidth variant="contained" color="primary" startIcon={<Category />} onClick={() => navigate("/admin/categories")}>
                        Manage Categories
                    </Button>
                    <Button fullWidth variant="contained" color="primary" startIcon={<ShoppingCart />} onClick={() => navigate("/admin/products")}>
                        Manage Products
                    </Button>
                    <Button fullWidth variant="contained" color="primary" startIcon={<ShoppingCart />} onClick={() => navigate("/admin/orders")}>
                        Manage Orders
                    </Button>
                    <Button fullWidth variant="contained" color="success" startIcon={<CalendarToday />} onClick={() => navigate("/admin/calendar")}>
                        View Calendar
                    </Button>
                    <Button fullWidth variant="contained" color="secondary" startIcon={<People />} onClick={() => navigate("/admin/employees")}>
                        Manage Employees
                    </Button>
                    <Button fullWidth variant="contained" color="warning" startIcon={<Reviews />} onClick={() => navigate("/admin/reviews")}>
                        Manage Reviews
                    </Button>
                    <Button fullWidth variant="contained" color="error" startIcon={<BarChart />} onClick={() => navigate("/admin/analytics")}>
                        View Analytics
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow p-6">
                <Routes>
                    <Route path="/categories" element={<AdminCategoryPage />} />
                    <Route path="/add-category" element={<AddCategory />} />
                    <Route path="/edit-category/:categoryId" element={<EditCategory />} />
                    <Route path="/products" element={<AdminProductPage />} />
                    <Route path="/add-product" element={<AddProductPage />} />
                    <Route path="/edit-product/:productId" element={<EditProductPage />} />
                    <Route path="/orders" element={<AdminOrdersPage />} />
                    <Route path="/order-details/:itemId" element={<AdminOrderDetailsPage />} />
                    <Route path="/calendar" element={<AdminCalendarPage />} />
                    <Route path="/employees" element={<AdminEmployeePage />} />
                    <Route path="/reviews" element={<AdminReviewPage />} />
                    <Route path="/analytics" element={<AdminAnalyticsPage />} />
                    <Route
                        path="/"
                        element={
                            <div>
                                <Typography variant="h4" className="font-bold mb-4">
                                    Welcome Admin 🎉
                                </Typography>
                                

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Card className="shadow-md">
                                            <CardContent>
                                                <Typography variant="h6">Total Products</Typography>
                                                <Typography variant="h4" className="font-bold">120</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Card className="shadow-md">
                                            <CardContent>
                                                <Typography variant="h6">Total Orders</Typography>
                                                <Typography variant="h4" className="font-bold">340</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Card className="shadow-md">
                                            <CardContent>
                                                <Typography variant="h6">Total Reviews</Typography>
                                                <Typography variant="h4" className="font-bold">89</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </div>
                        }
                    />
                </Routes>
            </div>
        </div>
    );
};

export default AdminPage;
