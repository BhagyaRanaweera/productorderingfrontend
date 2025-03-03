import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductList = ({ products }) => {
    const { cart, dispatch } = useCart();

    const addToCart = (product) => {
        dispatch({ type: "ADD_ITEM", payload: product });
    };

    const incrementItem = (product) => {
        dispatch({ type: "INCREMENT_ITEM", payload: product });
    };

    const decrementItem = (product) => {
        const cartItem = cart.find((item) => item.id === product.id);
        if (cartItem && cartItem.quantity > 1) {
            dispatch({ type: "DECREMENT_ITEM", payload: product });
        } else {
            dispatch({ type: "REMOVE_ITEM", payload: product });
        }
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {products.map((product, index) => {
                const cartItem = cart.find((item) => item.id === product.id);
                return (
                    <div
                        className="relative border rounded-lg shadow-md bg-white p-4 flex flex-col justify-between"
                        key={index}
                    >
                        <Link to={`/product/${product.id}`} className="mb-4">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-36 object-cover rounded-md mb-4"
                            />
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                {product.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                        </Link>

                        <div className="flex items-center justify-between mt-4">
                            <span className="text-xl font-bold text-blue-600">
                                ${product.price.toFixed(2)}
                            </span>
                            <div className="flex items-center space-x-2">
                                {cartItem ? (
                                    <div className="flex items-center space-x-2 mb-2">
                                        <button
                                            onClick={() => decrementItem(product)}
                                            className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                                        >
                                            -
                                        </button>
                                        <span className="font-semibold text-gray-700">
                                            {cartItem.quantity}
                                        </span>
                                        <button
                                            onClick={() => incrementItem(product)}
                                            className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600"
                                        >
                                            +
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="bg-gray-300 text-gray-800 py-1 px-3 rounded-md hover:bg-gray-400"
                                    >
                                        Add To Cart
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Adjusted rating stars position */}
                        <div className="mt-4 flex space-x-1">
                            <span className="text-yellow-400">
                                ★ ★ ★ ★ ★ {/* Hard-coded 5 stars */}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProductList;
