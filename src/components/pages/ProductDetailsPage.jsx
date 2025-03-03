import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ApiService from "../../service/ApiService";

// Function to render stars based on the rating value
const renderStars = (rating) => {
  const fullStars = Math.floor(rating); // Full stars based on the integer part of rating
  const halfStar = rating % 1 !== 0; // Half star if there is a fractional part
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Empty stars

  return (
    <>
      {[...Array(fullStars)].map((_, index) => (
        <span key={`full-${index}`} className="text-yellow-400">★</span>
      ))}
      {halfStar && <span className="text-yellow-400">★</span>}
      {[...Array(emptyStars)].map((_, index) => (
        <span key={`empty-${index}`} className="text-gray-300">★</span>
      ))}
    </>
  );
};

const ProductDetailsPage = () => {
    const { productId } = useParams();
    const { cart, dispatch } = useCart();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const fetchProduct = async () => {
        try {
            const response = await ApiService.getProductById(productId);
            setProduct(response.product);
        } catch (error) {
            console.log(error.message || error);
        }
    };

    const addToCart = () => {
        if (product) {
            dispatch({ type: 'ADD_ITEM', payload: product });
        }
    };

    const incrementItem = () => {
        if (product) {
            dispatch({ type: 'INCREMENT_ITEM', payload: product });
        }
    };

    const decrementItem = () => {
        if (product) {
            const cartItem = cart.find(item => item.id === product.id);
            if (cartItem && cartItem.quantity > 1) {
                dispatch({ type: 'DECREMENT_ITEM', payload: product });
            } else {
                dispatch({ type: 'REMOVE_ITEM', payload: product });
            }
        }
    };

    if (!product) {
        return <p className="text-center text-gray-500">Loading product details ...</p>;
    }

    const cartItem = cart.find(item => item.id === product.id);

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            {/* Product Image */}
            <img src={`https://product-ecommerce.s3.eu-north-1.amazonaws.com/${product.imageUrl}`} alt={product.name} className="w-full h-64 object-cover rounded-md" />
            
            {/* Product Title */}
            <h1 className="text-3xl font-bold mt-4">{product.name}</h1>
            
            {/* Product Description */}
            <p className="mt-2 text-gray-700">{product.description}</p>
            
            {/* Product Rating */}
            <div className="flex items-center mt-2">
                <span className="text-yellow-400">{renderStars(product.rating)}</span>
                <span className="ml-2 text-sm text-gray-500">({product.rating.toFixed(1)})</span>
            </div>
            
            {/* Price */}
            <span className="block mt-4 text-xl font-semibold">${product.price.toFixed(2)}</span>
            
            {/* Availability */}
            <p className={`mt-2 font-semibold ${product.availability ? 'text-green-500' : 'text-red-500'}`}>
                {product.availability ? 'In Stock' : 'Out of Stock'}
            </p>
            
            {/* Promotions */}
            {product.promotion && (
                <p className="mt-2 text-red-500 font-bold">
                    {product.promotion}
                </p>
            )}

            {/* Cart Actions */}
            {cartItem ? (
                <div className="flex items-center mt-4">
                    <button 
                        onClick={decrementItem} 
                        className="bg-gray-300 text-gray-800 rounded px-2 py-1"
                    >
                        -
                    </button>
                    <span className="mx-2">{cartItem.quantity}</span>
                    <button 
                        onClick={incrementItem} 
                        className="bg-gray-300 text-gray-800 rounded px-2 py-1"
                    >
                        +
                    </button>
                </div>
            ) : (
                <button 
                    onClick={addToCart} 
                    className="mt-4 w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                    Add To Cart
                </button>
            )}
        </div>
    );
};

export default ProductDetailsPage;
