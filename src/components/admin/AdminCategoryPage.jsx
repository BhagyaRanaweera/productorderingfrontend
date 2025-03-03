import React, { useState, useEffect } from "react";
import { Button, TextField, Typography, List, ListItem, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService"; // Ensure this service has the necessary methods

const AdminCategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await ApiService.getAllCategory();
            setCategories(response.categoryList || []);
        } catch (error) {
            console.log("Error fetching category list", error);
        }
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setCategoryName(category.name);
        setOpenDialog(true); // Open the dialog to edit category
    };

    const handleUpdate = async () => {
        if (!selectedCategory) return;

        try {
            await ApiService.updateCategory(selectedCategory.id, { name: categoryName });
            fetchCategories(); // Refresh the list
            setSelectedCategory(null);
            setCategoryName('');
            setOpenDialog(false); // Close the dialog
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const handleDelete = async (categoryId) => {
        try {
            await ApiService.deleteCategory(categoryId);
            fetchCategories(); // Refresh the list
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <Typography variant="h5" component="h2" gutterBottom>
                Categories
            </Typography>

            <Button 
                variant="contained"
                color="primary"
                onClick={() => navigate('/admin/add-category')} 
                sx={{ mb: 2 }}
            >
                Add Category
            </Button>

            <List>
                {categories.map((category) => (
                    <ListItem key={category.id} divider>
                        <ListItemText primary={category.name} />
                        <Button 
                            variant="outlined" 
                            color="warning" 
                            sx={{ mr: 2 }}
                            onClick={() => handleEdit(category)}
                        >
                            Edit
                        </Button>
                        <Button 
                            variant="outlined" 
                            color="error"
                            onClick={() => handleDelete(category.id)}
                        >
                            Delete
                        </Button>
                    </ListItem>
                ))}
            </List>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Edit Category</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        label="Category Name"
                        fullWidth
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AdminCategoryPage;
