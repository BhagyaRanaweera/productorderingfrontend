import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { useCart } from "../context/CartContext";

const CartPage = () => {
    const { cart, dispatch } = useCart();
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const incrementItem = (product) => {
        if (product.id) {
            dispatch({ type: 'INCREMENT_ITEM', payload: product });
        } else {
            console.error("Invalid product ID");
        }
    }

    const decrementItem = (product) => {
        if (product.id) {
            const cartItem = cart.find(item => item.id === product.id);
            if (cartItem && cartItem.quantity > 1) {
                dispatch({ type: 'DECREMENT_ITEM', payload: product });
            } else {
                dispatch({ type: 'REMOVE_ITEM', payload: product });
            }
        } else {
            console.error("Invalid product ID");
        }
    }

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleCheckout = async () => {
        if (cart.some(item => !item.id)) {
            setMessage("One or more items in your cart have invalid IDs.");
            return;
        }
    
        if (!ApiService.isAuthenticated()) {
            setMessage("You need to login first before you can place an order");
            setTimeout(() => {
                setMessage('');
                navigate("/login");
            }, 3000);
            return;
        }
    
        const orderItems = cart.map(item => ({
            productId: item.id,
            quantity: item.quantity
        }));
    
        const orderRequest = {
            totalPrice,
            items: orderItems,
        };
    
        try {
            const response = await ApiService.createOrder(orderRequest);
            setMessage(response.message);
    
            setTimeout(() => {
                setMessage('');
            }, 5000);
    
            if (response.status === 200) {
                dispatch({ type: 'CLEAR_CART' });
                navigate("/payment"); // Redirect to PaymentPage
            }
    
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || 'Failed to place an order');
            setTimeout(() => {
                setMessage('');
            }, 3000);
        }
    };
    


    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Cart</h1>
            {message && <p className="bg-yellow-200 text-yellow-800 p-2 rounded mb-4">{message}</p>}

            {cart.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <div>
                    <ul className="space-y-4">
                        {cart.map(item => {
                            // Check if the item has a valid ID
                            if (!item.id) {
                                console.error("Invalid item in cart", item);
                                return null; // Skip rendering invalid items
                            }
                            return (
                                <li key={item.id} className="flex items-center space-x-4 p-4 border border-gray-300 rounded-lg">
                                    <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold">{item.name}</h2>
                                        <p className="text-gray-600">{item.description}</p>
                                        <div className="flex items-center space-x-4 mt-2">
                                            <button onClick={() => decrementItem(item)} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md">-</button>
                                            <span className="text-lg">{item.quantity}</span>
                                            <button onClick={() => incrementItem(item)} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md">+</button>
                                        </div>
                                    </div>
                                    <span className="text-lg font-semibold">${item.price.toFixed(2)}</span>
                                </li>
                            );
                        })}
                    </ul>
                    <h2 className="text-2xl font-semibold mt-6">Total: ${totalPrice.toFixed(2)}</h2>
                    <button onClick={handleCheckout} className="mt-4 py-2 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Checkout</button>
                </div>
            )}
        </div>
    );
}

export default CartPage;
