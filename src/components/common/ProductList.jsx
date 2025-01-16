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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {products.map((product, index) => {
                const cartItem = cart.find((item) => item.id === product.id);
                return (
                    <div
                        className="border rounded-lg shadow-md bg-white p-4 hover:shadow-lg transition-shadow"
                        key={index}
                    >
                        <Link to={`/product/${product.id}`}>
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-48 object-cover rounded-md mb-4"
                            />
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                {product.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                            <span className="text-xl font-bold text-blue-600">
                                ${product.price.toFixed(2)}
                            </span>
                        </Link>
                        <div className="mt-4">
                            {cartItem ? (
                                <div className="flex items-center space-x-2">
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
                                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                                >
                                    Add To Cart
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProductList;
