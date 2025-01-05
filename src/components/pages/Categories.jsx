// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import ApiService from "../../service/ApiService";

// const Categories = () => {
//   const [categories, setCategories] = useState([]);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const response = await ApiService.getAllCategory();
//       setCategories(response.categoryList || []);
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || "Unable to fetch categories");
//     }
//   };

//   const handleCategoryClick = (categoryId) => {
//     // Navigate to the ProductPage with the selected categoryId
//     navigate(`/category/${categoryId}`);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 py-10 px-6">
//       <div className="max-w-6xl mx-auto">
//         {error ? (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
//             <span className="block sm:inline">{error}</span>
//           </div>
//         ) : (
//           <div className="bg-white shadow-lg rounded-xl p-8">
//             <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
//               Explore Categories
//             </h2>
//             <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {categories.map((category) => (
//                 <li key={category.id} className="text-center">
//                   <button
//                     onClick={() => handleCategoryClick(category.id)}
//                     className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium py-4 px-6 rounded-lg shadow-md transform hover:scale-105 transition duration-300"
//                   >
//                     {category.name}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Categories;
