import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../common/Pagination";
import ApiService from "../../service/ApiService";

const OrderStatus = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState(null);
    const itemsPerPage = 10;

    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, [searchStatus, currentPage]);

    const fetchOrders = async () => {
        try {
            let response;
            if (searchStatus) {
                response = await ApiService.getAllOrderItemsByStatus(searchStatus);
            } else {
                response = await ApiService.getAllOrders();
            }
            const orderList = response.orderItemList || [];
            setTotalPages(Math.ceil(orderList.length / itemsPerPage));
            setOrders(orderList);
            setFilteredOrders(orderList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Unable to fetch orders');
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    };

    const handleFilterChange = (e) => {
        const filterValue = e.target.value;
        setStatusFilter(filterValue);
        setCurrentPage(1);

        if (filterValue) {
            const filtered = orders.filter(order => order.status === filterValue);
            setFilteredOrders(filtered.slice(0, itemsPerPage));
            setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        } else {
            setFilteredOrders(orders.slice(0, itemsPerPage));
            setTotalPages(Math.ceil(orders.length / itemsPerPage));
        }
    };

    const handleSearchStatusChange = async (e) => {
        setSearchStatus(e.target.value);
        setCurrentPage(1);
    };

    const handleOrderDetails = (id) => {
        navigate(`/admin/order-details/${id}`);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-4">Orders</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex justify-between mb-4">
                <div className="flex items-center">
                    <label className="mr-2">Filter By Status:</label>
                    <select value={statusFilter} onChange={handleFilterChange} className="border rounded-md p-2">
                        <option value="">All</option>
                        {OrderStatus.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center">
                    <label className="mr-2">Search By Status:</label>
                    <select value={searchStatus} onChange={handleSearchStatusChange} className="border rounded-md p-2">
                        <option value="">All</option>
                        {OrderStatus.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            </div>

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="border-b py-2 px-4 text-left">Order ID</th>
                        <th className="border-b py-2 px-4 text-left">Customer</th>
                        <th className="border-b py-2 px-4 text-left">Status</th>
                        <th className="border-b py-2 px-4 text-left">Price</th>
                        <th className="border-b py-2 px-4 text-left">Date Ordered</th>
                        <th className="border-b py-2 px-4 text-left">Actions</ th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-100">
                            <td className="border-b py-2 px-4">{order.id}</td>
                            <td className="border-b py-2 px-4">{order.user.name}</td>
                            <td className="border-b py-2 px-4">{order.status}</td>
                            <td className="border-b py-2 px-4">${order.price.toFixed(2)}</td>
                            <td className="border-b py-2 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="border-b py-2 px-4">
                                <button 
                                    onClick={() => handleOrderDetails(order.id)} 
                                    className="bg-blue-500 text-white font-semibold py-1 px-3 rounded-md hover:bg-blue-600 transition duration-200"
                                >
                                    Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
};

export default AdminOrdersPage;