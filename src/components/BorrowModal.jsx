import { useState } from "react";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";

export default function BorrowModal({ isOpen, book, onClose, onBorrow }) {
  if (!isOpen) return null;
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const handleBorrow = () => {
    if (pickupDate && returnDate) {
      onBorrow( book?.id, pickupDate, returnDate);
      onClose();
    } else {
      toast.error("Please select both pickup and return dates.");
    }
  };

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
          <div>
            <h2 className="text-2xl font-semibold text-orange-400">{book?.title}</h2>
            <p className="text-[#d5dfff] mt-1"><span className="font-bold">Author:</span> {book?.author}</p>
            <p className="text-[#d5dfff]"><span className="font-bold">ISBN:</span> {book?.isbn}</p>
          </div>
        </div>

        {/* Date Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Pickup Date</label>
            <input 
              type="date" 
              value={pickupDate} 
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full p-2 rounded bg-[#2e3650] text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Return Date</label>
            <input 
              type="date" 
              value={returnDate} 
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full p-2 rounded bg-[#2e3650] text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Borrow Button */}
        <div className="mt-6">
          <button 
            onClick={handleBorrow}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded w-full"
          >
            Borrow Book
          </button>
        </div>

      </div>
    </div>
  );
}
