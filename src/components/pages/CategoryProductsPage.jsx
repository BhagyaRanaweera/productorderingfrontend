import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../../service/ApiService";
import ProductList from "../common/ProductList";
import Pagination from "../common/Pagination";
import { FormControl, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";

const CategoryProductsPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all"); // Default to all categories
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [priceRange, setPriceRange] = useState("all");
  const [sortOrder, setSortOrder] = useState("price-asc"); 
  const itemsPerPage = 8;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, currentPage]);

  useEffect(() => {
    filterProducts();
  }, [products, priceRange, sortOrder]);

  const fetchCategories = async () => {
    try {
      const response = await ApiService.getAllCategory();
      const categoryList = response.categoryList || [];
      setCategories([{ id: "all", name: "All Categories" }, ...categoryList]);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      console.log(`Fetching products for category ID: ${selectedCategory}`);
      const response =
        selectedCategory === "all"
          ? await ApiService.getAllProducts({ page: currentPage, size: itemsPerPage }) // Fetch all products
          : await ApiService.getProductsByCategory(selectedCategory, { page: currentPage, size: itemsPerPage });

      setTotalPages(response.totalPage);
      setProducts(response.productList || []);
      setFilteredProducts(response.productList || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Unable to fetch products. Please try again later.");
    }
  };

  const filterProducts = () => {
    const { minPrice, maxPrice } = getPriceRange(priceRange);

    let filtered =
      priceRange === "all"
        ? products
        : products.filter((product) => product.price >= minPrice && product.price <= maxPrice);

    const sortedProducts = sortProducts(filtered, sortOrder);
    setFilteredProducts(sortedProducts);
  };

  const getPriceRange = (range) => {
    switch (range) {
      case "$0-$50":
        return { minPrice: 0, maxPrice: 50 };
      case "$51-$100":
        return { minPrice: 51, maxPrice: 100 };
      case "$100-$500":
        return { minPrice: 100, maxPrice: 500 };
      case "$500+":
        return { minPrice: 500, maxPrice: 10000 };
      default:
        return { minPrice: 0, maxPrice: 10000 };
    }
  };

  const sortProducts = (products, criteria) => {
    switch (criteria) {
      case "price-asc":
        return [...products].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...products].sort((a, b) => b.price - a.price);
      case "name-asc":
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return [...products].sort((a, b) => b.name.localeCompare(a.name));
      case "newest":
        return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "oldest":
        return [...products].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      default:
        return products;
    }
  };

  return (
    <div className="flex flex-wrap max-w-6xl mx-auto p-6">
      {/* Left Sidebar for Filters */}
      <div className="w-full md:w-1/4 lg:w-1/5 p-4 border-r">
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Category Filter */}
        <Typography variant="h6" gutterBottom>
          Select Category
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            {categories.map((category) => (
              <FormControlLabel
                key={category.id}
                value={category.id}
                control={<Radio />}
                label={category.name}
              />
            ))}
          </RadioGroup>
        </FormControl>

        {/* Price Range Filter */}
        <Typography variant="h6" gutterBottom className="mt-4">
          Filter by Price Range
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup value={priceRange} onChange={(event) => setPriceRange(event.target.value)}>
            <FormControlLabel value="all" control={<Radio />} label="All Prices" />
            <FormControlLabel value="$0-$50" control={<Radio />} label="$0 - $50" />
            <FormControlLabel value="$51-$100" control={<Radio />} label="$51 - $100" />
            <FormControlLabel value="$100-$500" control={<Radio />} label="$100 - $500" />
            <FormControlLabel value="$500+" control={<Radio />} label="$500+" />
          </RadioGroup>
        </FormControl>

        {/* Sorting Options */}
        <Typography variant="h6" gutterBottom className="mt-4">
          Sort Products
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
            <FormControlLabel value="price-asc" control={<Radio />} label="Price: Low to High" />
            <FormControlLabel value="price-desc" control={<Radio />} label="Price: High to Low" />
            <FormControlLabel value="name-asc" control={<Radio />} label="Name: A-Z" />
            <FormControlLabel value="name-desc" control={<Radio />} label="Name: Z-A" />
            <FormControlLabel value="newest" control={<Radio />} label="Newest First" />
            <FormControlLabel value="oldest" control={<Radio />} label="Oldest First" />
          </RadioGroup>
        </FormControl>
      </div>

      {/* Right Side for Products */}
      <div className="w-full md:w-3/4 lg:w-4/5 p-4">
        <ProductList products={filteredProducts} />
        {filteredProducts.length === 0 && !error && (
          <p className="text-center text-gray-500">No products found.</p>
        )}

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
