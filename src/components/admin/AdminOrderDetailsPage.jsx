import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../../service/ApiService";

const OrderStatus = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];

const AdminOrderDetailsPage = () => {
    const { itemId } = useParams();
    const [orderItems, setOrderItems] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedStatus, setSelectedStatus] = useState({});

    useEffect(() => {
        fetchOrderDetails(itemId);
    }, [itemId]);

    const fetchOrderDetails = async (itemId) => {
        try {
            const response = await ApiService.getOrderItemById(itemId);
            setOrderItems(response.orderItemList);
        } catch (error) {
            console.log(error.message || error);
        }
    };

    const handleStatusChange = (orderItemId, newStatus) => {
        setSelectedStatus({ ...selectedStatus, [orderItemId]: newStatus });
    };

    const handleSubmitStatusChange = async (orderItemId) => {
        console.log("Order Item ID:", orderItemId);
        console.log("Selected Status:", selectedStatus[orderItemId]);
    
        try {
            await ApiService.updateOrderitemStatus(orderItemId, selectedStatus[orderItemId]);
            setMessage('Order item status was successfully updated');
            setTimeout(() => {
                setMessage('');
            }, 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || 'Unable to update order item status');
        }
    };
    

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            {message && <div className="text-green-500 mb-4">{message}</div>}
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            {orderItems.length ? (
                orderItems.map((orderItem) => (
                    <div key={orderItem.id} className="border-b pb-4 mb-4">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Order Information</h3>
                            <p><strong>Order Item ID:</strong> {orderItem.id}</p>
                            <p><strong>Quantity:</strong> {orderItem.quantity}</p>
                            <p><strong>Total Price:</strong> ${orderItem.price.toFixed(2)}</p>
                            <p><strong>Order Status:</strong> {orderItem.status}</p>
                            <p><strong>Date Ordered:</strong> {new Date(orderItem.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">User  Information</h3>
                            <p><strong>Name:</strong> {orderItem.user.name}</p>
                            <p><strong>Email:</strong> {orderItem.user.email}</p>
                            <p><strong>Phone:</strong> {orderItem.user.phoneNumber}</p>
                            <p><strong>Role:</strong> {orderItem.user.role}</p>
                        </div>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Delivery Address</h3>
                            <p><strong>Country:</strong> {orderItem.user.address?.country}</p>
                            <p><strong>State:</strong> {orderItem.user.address?.state}</p>
                            <p><strong>City:</strong> {orderItem.user.address?.city}</p>
                            <p><strong>Street:</strong> {orderItem.user.address?.street}</p>
                            <p><strong>Zip Code:</strong> {orderItem.user.address?.zipcode}</p>
                        </div>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Product Information</h3>
                            <img src={orderItem.product.imageUrl} alt={orderItem.product.name} className="w-32 h-32 object-cover rounded-md mb-2" />
                            <p><strong>Name:</strong> {orderItem.product.name}</p>
                            <p><strong>Description:</strong> {orderItem.product.description}</p>
                            <p><strong>Price:</strong> ${orderItem.product.price.toFixed(2)}</p>
                        </div>
                        <div className="mb-4">
                            <h4 className="text-lg font-semibold">Change Status</h4>
                            <select
                                className="border rounded-md p-2 mr-2"
                                value={selectedStatus[orderItem.id] || orderItem.status}
                                onChange={(e) => handleStatusChange(orderItem.id, e.target.value)}
                            >
                                {OrderStatus.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                            <button 
                                className="bg-blue-500 text-white font-semibold py-1 px-3 rounded-md hover:bg-blue-600 transition duration-200" 
                                onClick={() => handleSubmitStatusChange(orderItem.id)}
                            >
                                Update Status
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">Loading order details ....</p>
            )}
        </div>
    );
};

export default AdminOrderDetailsPage;