import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { Button, List, ListItem, ListItemText, Typography, CircularProgress, Box } from "@mui/material";
import { useSpring, animated } from 'react-spring'; // For animations
import ReactConfetti from 'react-confetti'; // For confetti celebration

const CategoryListPage = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false); // To trigger confetti
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await ApiService.getAllCategory();
            setCategories(response.categoryList || []);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Unable to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (categoryId) => {
        setShowConfetti(true); // Trigger confetti when category is clicked
        setTimeout(() => setShowConfetti(false), 5000); // Hide confetti after 5 seconds
        navigate(`/category/${categoryId}`);
    };

    // Spring animation for the category list
    const fadeIn = useSpring({
        opacity: 1,
        from: { opacity: 0 },
        reset: true,
        reverse: loading || error ? true : false,
    });

    return (
        <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 3, position: "relative" }}>
            {/* Triggering confetti on category selection */}
            {showConfetti && <ReactConfetti recycle={false} />}

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center">
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography variant="h6" color="error" align="center">{error}</Typography>
            ) : (
                <div>
                    <Typography variant="h4" align="center" gutterBottom>
                        Categories
                    </Typography>
                    <animated.div style={fadeIn}>
                        <Box display="flex" flexWrap="wrap" justifyContent="center">
                            {categories.map((category) => (
                                <ListItem
                                    key={category.id}
                                    sx={{
                                        margin: 1,
                                        backgroundColor: "#fff",
                                        borderRadius: "8px",
                                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                                        width: "150px",
                                        textAlign: "center",
                                        "&:hover": {
                                            backgroundColor: "#f1f1f1",
                                            cursor: "pointer",
                                        },
                                    }}
                                    onClick={() => handleCategoryClick(category.id)}
                                >
                                    <ListItemText
                                        primary={category.name}
                                        primaryTypographyProps={{
                                            variant: "h6",
                                            fontWeight: "bold",
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </Box>
                    </animated.div>
                </div>
            )}
        </Box>
    );
};

export default CategoryListPage;
