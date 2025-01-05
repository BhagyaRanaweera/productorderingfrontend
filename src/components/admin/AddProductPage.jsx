import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";

const AddProductPage = () => {
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [price, setPrice] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        ApiService.getAllCategory().then((res) => setCategories(res.categoryList));
    }, []);

    const handleImage = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('image', image);
            formData.append('categoryId', categoryId);
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);

            const response = await ApiService.addProduct(formData);
            if (response.status === 200) {
                setMessage(response.message);
                setTimeout(() => {
                    setMessage('');
                    navigate('/admin/products');
                }, 3000);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || error.message || 'Unable to upload product');
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <form onSubmit={handleSubmit} className="product-form">
                <h2 className="text-2xl font-bold mb-4">Add Product</h2>
                {message && <div className="text-green-500 mb-4">{message}</div>}
                
                <input 
                    type="file" 
                    onChange={handleImage} 
                    className="mb-4 border border-gray-300 rounded-md p-2 w-full"
                />
                
                <select 
                    value={categoryId} 
                    onChange={(e) => setCategoryId(e.target.value)} 
                    className="mb-4 border border-gray-300 rounded-md p-2 w-full"
                >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option value={cat.id} key={cat.id}>{cat.name}</option>
                    ))}
                </select>
                
                <input 
                    type="text" 
                    placeholder="Product name"
                    value={name}
                    onChange={(e) => setName(e.target.value)} 
                    className="mb-4 border border-gray-300 rounded-md p-2 w-full"
                />

                <textarea 
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mb-4 border border-gray-300 rounded-md p-2 w-full"
                />

                <input 
                    type="number" 
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)} 
                    className="mb-4 border border-gray-300 rounded-md p-2 w-full"
                />

                <button 
                    type="submit" 
                    className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                    Add Product
                </button>
            </form>
        </div>
    );
};

export default AddProductPage;