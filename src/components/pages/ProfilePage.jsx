import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import Pagination from "../common/Pagination";

const ProfilePage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const response = await ApiService.getLoggedInUserInfo();
            setUserInfo(response.user);
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Unable to fetch user info');
        }
    };

    if (!userInfo) {
        return <div className="text-center text-gray-500">Loading...</div>;
    }

    const handleAddressClick = () => {
        navigate(userInfo.address ? '/edit-address' : '/add-address');
    };

    const orderItemList = userInfo.orderItemList || [];
    const totalPages = Math.ceil(orderItemList.length / itemsPerPage);
    const paginatedOrders = orderItemList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-4">Welcome {userInfo.name}</h2>

            {error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div>
                    <p><strong>Name: </strong>{userInfo.name}</p>
                    <p><strong>Email: </strong>{userInfo.email}</p>
                    <p><strong>Phone Number: </strong>{userInfo.phoneNumber}</p>

                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Address</h3>
                        {userInfo.address ? (
                            <div className="mt-2">
                                <p><strong>Street: </strong>{userInfo.address.street}</p>
                                <p><strong>City: </strong>{userInfo.address.city}</p>
                                <p><strong>State: </strong>{userInfo.address.state}</p>
                                <p><strong>Zip Code: </strong>{userInfo.address.zipCode}</p>
                                <p><strong>Country: </strong>{userInfo.address.country}</p>
                            </div>
                        ) : (
                            <p>No Address information available</p>
                        )}
                        <button 
                            className="mt-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-200" 
                            onClick={handleAddressClick}
                        >
                            {userInfo.address ? "Edit Address" : "Add Address"}
                        </button>
                    </div>

                    <h3 className="text-lg font-semibold mt-4">Order History</h3>
                    <ul className="mt-2">
                        {paginatedOrders.map(order => (
                            <li key={order.id} className="flex items-center border-b py-2">
                                <img 
                                    src={order.product?.imageUrl || "/images/placeholder.png"} 
                                    alt={order.product.name} 
                                    className="w-16 h-16 object-cover rounded-md mr-4" 
                                />
                                <div>
                                    <p><strong>Name: </strong>{order.product.name}</p>
                                    <p><strong>Status: </strong>{order.status}</p>
                                    <p><strong>Quantity: </strong>{order.quantity}</p>
                                    <p><strong>Price: </strong>${order.price.toFixed(2)}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            )}
        </div>
    );
};

export default ProfilePage;