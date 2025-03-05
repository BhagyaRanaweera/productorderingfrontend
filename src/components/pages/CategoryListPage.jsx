import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { Typography, CircularProgress, Box, Card, CardActionArea, CardMedia, CardContent } from "@mui/material";
import { useSpring, animated } from "react-spring";
import ReactConfetti from "react-confetti";

// Mapping category names to default images
const categoryImages = {
    "Electronics": "https://e7.pngegg.com/pngimages/140/699/png-clipart-smartphone-feature-phone-mobile-phones-product-handheld-devices-mobile-client-electronics-gadget.png",
    "Clothing": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRky6dqpWx2wwkuW8WZiX1KvkVnmxGFSxOSkw&s",
    "Furniture": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEzVonUbZHFKfbR7GIbRWA1N9OgFEv_ymkWQ&s",
    "Sports": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7SwDmjL8gE_XWMzRcykQ1jbuiC4pfKz6YIQ&s",
    "Books": "https://png.pngtree.com/png-vector/20230903/ourmid/pngtree-stack-of-books-png-image_9939070.png",
    "Toys": "https://img.freepik.com/premium-photo/colorful-toys-collection-desk_488220-3796.jpg?semt=ais_hybrid",
    "Men": " https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDtiUJvf1x3VqpleWi5OQJP_fdNhk7ueu4Cg&s",
    "Women": " https://w7.pngwing.com/pngs/547/432/png-transparent-handbag-clothing-accessories-leather-women-bag-fashion-clothing-accessories-women-bag-thumbnail.png",
    "Kids": " https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhbzchEsfxYSavcjoTqApkaSdCLK3QgpSsrw&s",
    "Jewelry": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9JwwWKHtC3Vd5xhEL3yLpbH2XoFX83rglyg&s",
    "Cosmetic": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLbH3JUr9oygKIgZS8oVP9LhUbz1PN5JxE5Q&s",
    "Sunglass": "https://www.thesunglassfix.com/image/blog/SF-are-your-sunglasses-real-or-fake-2.jpg",
    "Perfumes": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fperfumesreal.com%2F&psig=AOvVaw0HRfoCRgXsN8fx9hIV2nCi&ust=1741275847966000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKCDt5ik84sDFQAAAAAdAAAAABAE",
    
    
};

const CategoryListPage = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await ApiService.getAllCategory();
            // Assign an image automatically if not provided
            const updatedCategories = (response.categoryList || []).map(category => ({
                ...category,
                imageUrl: category.imageUrl || categoryImages[category.name] || "https://via.placeholder.com/150",
            }));
            setCategories(updatedCategories);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Unable to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (categoryId) => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        navigate(`/category/${categoryId}`);
    };

    const fadeIn = useSpring({
        opacity: 1,
        from: { opacity: 0 },
        reset: true,
        reverse: loading || error ? true : false,
    });

    return (
        <Box sx={{ maxWidth: 800, margin: "0 auto", padding: 3, position: "relative" }}>
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
                        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
                            {categories.map((category) => (
                                <Card
                                    key={category.id}
                                    sx={{
                                        width: 180,
                                        borderRadius: 2,
                                        boxShadow: 2,
                                        "&:hover": { boxShadow: 4, transform: "scale(1.05)", transition: "0.3s" },
                                    }}
                                >
                                    <CardActionArea onClick={() => handleCategoryClick(category.id)}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={category.imageUrl}
                                            alt={category.name}
                                        />
                                        <CardContent>
                                            <Typography variant="h6" align="center" fontWeight="bold">
                                                {category.name}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            ))}
                        </Box>
                    </animated.div>
                </div>
            )}
        </Box>
    );
};

export default CategoryListPage;
