// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import ApiService from "../../service/ApiService";

// const ProductPage = () => {
//   const { categoryId } = useParams(); // Get categoryId from the URL
//   const [products, setProducts] = useState([]);
//   const [error, setError] = useState(null);

//   // Fetch products when categoryId changes
//   useEffect(() => {
//     fetchProductsByCategoryId();
//   }, [categoryId]);

//   const fetchProductsByCategoryId = async () => {
//     try {
//       // Fetch products from the backend using ApiService
//       const response = await ApiService.getAllProducts(categoryId);
//       setProducts(response.productList || []);  // Assuming response contains 'productList'
//       setError(null); // Clear any previous errors
//     } catch (err) {
//       setError("Unable to fetch products");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 py-10 px-6">
//       <div className="max-w-7xl mx-auto">
//         {error ? (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
//             <span className="block sm:inline">{error}</span>
//           </div>
//         ) : (
//           <div className="bg-white shadow-lg rounded-xl p-8">
//             <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
//               {categoryId ? `Products for Category ${categoryId}` : "All Products"}
//             </h2>
//             <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {products.length > 0 ? (
//                 products.map((product) => (
//                   <li key={product.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
//                     <img
//                       src={product.imageUrl || "/placeholder.png"} // Fallback for missing images
//                       alt={product.name}
//                       className="w-full h-48 object-cover rounded-t-lg"
//                     />
//                     <div className="mt-4">
//                       <h3 className="text-lg font-bold text-gray-700">{product.name}</h3>
//                       <p className="text-sm text-gray-500">{product.description}</p>
//                       <p className="mt-2 text-lg font-semibold text-indigo-600">${product.price.toFixed(2)}</p>
//                     </div>
//                   </li>
//                 ))
//               ) : (
//                 <p className="text-center text-gray-600 mt-8">No products available in this category.</p>
//               )}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductPage;
