import React from "react";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";

const apiUrl = import.meta.env.VITE_API_URL;
export default function BorrowModal({ isOpen, book, onClose, cancel = false, borrowing = null }) {
  if (!isOpen || !book) return null;

  const handleAction = () => {
    if (cancel) {
      cancelBorrowing();
      window.location.reload();
      retrun;
    }
    if (book.available) {
      borrow();
    } else {
      toast.error("The book is not currently available. Please try again later.");
    }
  };
  const cancelBorrowing = async() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("token:", user.token);
    try {
      const response = await fetch(`${apiUrl}/api/member/borrowing/${borrowing?.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
      })
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      const data = await response.json();
      toast.success("Cancellation done successfully");
      console.log("Cancellation successful:", data);
      onClose();
    } catch (error) {
      toast.error(error.message);
      console.log("Error:", error.message);
    }

  }
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
      onClose();
    } catch (error) {
      toast.error(error.message);
      console.log("Error:", error.message);
    }

  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#1a2238] text-white rounded-lg p-6 w-full max-w-xl relative flex">

        {/* Book Cover */}
        <div className="flex-shrink-0 w-[180px] h-[240px] bg-gray-800 rounded flex items-center justify-center">
          <CoverImage coverUrl={book?.coverUrl} title={book.title}/>
        </div>

        {/* Content */}
        <div className="ml-6 flex-1 flex flex-col justify-between">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white text-xl"
          >
            <FaTimes />
          </button>

          <div>
            <h2 className="text-xl font-bold text-orange-400 mb-1">
              Confirm {cancel ? "Cancellation " : "Borrow"}
            </h2>
            <p className="text-white mb-2">Are you sure you want to {cancel ? "cancel borrowing" : "borrow"}</p>
            <p className="text-[#d5dfff] font-semibold mb-4">{book?.title}</p>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAction}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded transition font-semibold"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
