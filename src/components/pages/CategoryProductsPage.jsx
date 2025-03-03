import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../../service/ApiService";
import ProductList from "../common/ProductList";
import Pagination from "../common/Pagination";
import { Slider, FormControl, InputLabel, MenuItem, Select, Typography, Checkbox, FormControlLabel, FormGroup } from "@mui/material";

const CategoryProductsPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const itemsPerPage = 8;

  // Example category types (you can fetch this dynamically from your API if needed)
  const categoryTypes = ["Electronics", "Clothing", "Furniture", "Books", "Toys"];

  useEffect(() => {
    fetchProducts();
  }, [categoryId, currentPage, priceRange, sortOrder, selectedCategories]);

  const fetchProducts = async () => {
    try {
      console.log(`Fetching products for category ID: ${categoryId}`);
      const response = await ApiService.getProductsByCategory(categoryId, {
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        order: sortOrder,
        page: currentPage,
        size: itemsPerPage,
        categories: selectedCategories,
      });
      console.log('API Response:', response);

      const allProducts = response.productList || [];
      console.log('All Products:', allProducts);

      setTotalPages(response.totalPage);
      setProducts(allProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError("Unable to fetch products. Please try again later.");
    }
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    setSelectedCategories((prevCategories) =>
      checked ? [...prevCategories, value] : prevCategories.filter((category) => category !== value)
    );
  };

  return (
    <div className="flex flex-wrap max-w-6xl mx-auto p-6">
      {/* Left Sidebar for Filters */}
      <div className="w-full md:w-1/4 lg:w-1/5 p-4 border-r">
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Price Range Filter */}
        <Typography variant="h6" gutterBottom>
          Filter by Price Range
        </Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceRangeChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `$${value}`}
          min={0}
          max={10000}
          step={100}
        />
        <Typography variant="body1">
          Price: ${priceRange[0]} - ${priceRange[1]}
        </Typography>

        {/* Sort by Price */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="sort-order-label">Sort by Price</InputLabel>
          <Select
            labelId="sort-order-label"
            value={sortOrder}
            label="Sort by Price"
            onChange={handleSortChange}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>

        {/* Category Types Filter */}
        <Typography variant="h6" gutterBottom>
          Filter by Category Type
        </Typography>
        <FormGroup>
          {categoryTypes.map((category) => (
            <FormControlLabel
              key={category}
              control={
                <Checkbox
                  checked={selectedCategories.includes(category)}
                  onChange={handleCategoryChange}
                  value={category}
                  color="primary"
                />
              }
              label={category}
            />
          ))}
        </FormGroup>
      </div>

      {/* Right Side for Products */}
      <div className="w-full md:w-3/4 lg:w-4/5 p-4">
        {/* Product List */}
        <ProductList products={products} />
        {products.length === 0 && !error && <p className="text-center text-gray-500">No products found for this category.</p>}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryProductsPage;
