import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex justify-center mt-4">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
                Previous
            </button>
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-4 py-2 mx-1 ${
                        page === currentPage
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                    } rounded hover:bg-gray-300`}
                >
                    {page}
                </button>
            ))}
            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
