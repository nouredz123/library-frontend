import { useState } from "react";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";

const apiUrl = import.meta.env.VITE_API_URL;
export default function BorrowModal({ isOpen, book, onClose }) {
  if (!isOpen) return null;

  const handleBorrow = () => {
    if (book.available) {
      borrow();
    } else {
      toast.error("The book is not currently available. Please try again later.");
    }

  };
  const borrow = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("token:", user.token);
    try {
      const response = await fetch(`${apiUrl}/api/member/borrow`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          bookId: book.id,
          memberId: user.id,
        })
      })
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      const data = await response.json();
      toast.success("Borrowings done successfully");
      console.log("Borrow successful:", data);

    } catch (error) {
      toast.error(error.message);
      console.log("Error:", error.message);
    }

  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1a2238] text-white rounded-lg p-6 max-w-xl w-full relative">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl leading-none"
        >
          <FaTimes />
        </button>

        {/* Book Info */}
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={book?.coverUrl || "/assets/images/book-placeholder.jpg"}
            alt="Book Cover"
            className="w-32 h-44 object-cover rounded"
          />
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-orange-400">{book?.title}</h2>
            <p className="text-[#d5dfff] mt-1"><span className="font-bold">Author:</span> {book?.author}</p>
            <p className="text-[#d5dfff]"><span className="font-bold">Publish Year:</span> {book?.editionYear}</p>
            <p className="text-[#d5dfff] mt-1"><span className="font-bold">Publisher:</span> {book?.publisher}</p>
            <p className="text-[#d5dfff]"><span className="font-bold">ISBN:</span> {book?.isbn}</p>
            <p className="text-[#d5dfff]"><span className={`font-bold ${book.available ? "text-green-500" : "text-red-500"} `}>{book.available ? "Available" : "Not available"}</span></p>
          </div>
        </div>


        {/* Confirm Borrow Button */}
        <div className="mt-6">
          <button
            onClick={handleBorrow}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded w-full"
          >
            Confirm borrowing
          </button>
        </div>

      </div>
    </div>
  );
}
