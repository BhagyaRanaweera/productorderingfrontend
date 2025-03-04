import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../../service/ApiService";
import ProductList from "../common/ProductList";
import Pagination from "../common/Pagination";
import { Slider, FormControl, InputLabel, MenuItem, Select, Typography, TextField } from "@mui/material";

const CategoryProductsPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [name, setName] = useState("");
  const [sortBy, setSortBy] = useState("price");
  const [sortDirection, setSortDirection] = useState("asc");
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    handleFilter();
  }, [categoryId, currentPage, minPrice, maxPrice, name, sortBy, sortDirection]);

  const handleFilter = async () => {
    setLoading(true);
    try {
      console.log(`Fetching products for category ID: ${categoryId}`);

      const response = await ApiService.filterProducts({
        categoryId,
        minPrice,
        maxPrice,
        name,
        sortBy,
        sortDirection,
        page: currentPage,
        size: itemsPerPage,
      });

      const allProducts = response.productList || [];
      setTotalPages(response.totalPage);
      setProducts(allProducts);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError("Unable to fetch products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePriceRangeChange = (event, newValue) => {
    setMinPrice(newValue[0]);
    setMaxPrice(newValue[1]);
  };

  const handleSortChange = (event) => {
    setSortDirection(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  return (
    <div className="flex flex-wrap max-w-6xl mx-auto p-6">
      {/* Left Sidebar for Filters */}
      <div className="w-full md:w-1/4 lg:w-1/5 p-4 border-r">
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Name Filter */}
        <TextField
          label="Search by Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={handleNameChange}
          margin="normal"
        />

        {/* Price Range Filter */}
        <Typography variant="h6" gutterBottom>
          Filter by Price Range
        </Typography>
        <Slider
          value={[minPrice, maxPrice]}
          onChange={handlePriceRangeChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `$${value}`}
          min={0}
          max={10000}
          step={100}
        />
        <Typography variant="body1">
          Price: ${minPrice} - ${maxPrice}
        </Typography>

        {/* Sort by Price */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="sort-order-label">Sort by Price</InputLabel>
          <Select
            labelId="sort-order-label"
            value={sortDirection}
            label="Sort by Price"
            onChange={handleSortChange}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Right Side for Products */}
      <div className="w-full md:w-3/4 lg:w-4/5 p-4">
        {/* Loading Indicator */}
        {loading && <p className="text-center">Loading products...</p>}

        {/* Product List */}
        <ProductList products={products} />
        {products.length === 0 && !error && !loading && (
          <p className="text-center text-gray-500">No products found for this category.</p>
        )}

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
