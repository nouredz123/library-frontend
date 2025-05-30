import React, { useState, useEffect } from 'react';

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        className="px-4 py-2 bg-[#232738] text-[#d5dfff] rounded-l-lg hover:bg-[#db4402] disabled:opacity-50 disabled:hover:bg-[#232738]"
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 0}
      >
        Previous
      </button>

      <div className="flex gap-1">
        {pageNumbers.map((number) => (
          <button
            key={number}
            className={`px-3 py-1 rounded ${currentPage === number ? 'bg-[#db4402] text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            onClick={() => setCurrentPage(number)}
          >
            {number + 1}
          </button>
        ))}
      </div>

      <button
        className="px-4 py-2 bg-[#232738] text-[#d5dfff] rounded-r-lg hover:bg-[#db4402] disabled:opacity-50 disabled:hover:bg-[#232738]"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
