import React from "react";

const ProductCard = ({ product }) => {
    console.log(`https://product-ecommerce.s3.eu-north-1.amazonaws.com/${product.imageUrl}`);
    
    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col transition-transform transform hover:scale-105 duration-200">
            <img
                src={`https://product-ecommerce.s3.eu-north-1.amazonaws.com/${product.imageUrl}`}
                alt={product.name}
                className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col justify-between flex-grow">
                <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-green-600 font-bold mt-2">${product.price.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default ProductCard;