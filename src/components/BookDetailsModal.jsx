import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import BorrowModal from "./BorrowModal";
import CoverImage from "./CoverImage";


export default function BookDetailsModal({ isOpen, onClose, book, borrowing = null }) {
  if (!isOpen || !book) return null;

  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [cancel, setCancel] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1a2238] text-white rounded-lg p-6 max-w-2xl w-full relative flex">

        {/* Left side: Book Cover */}
        <div className="flex-shrink-0 w-[232px] min-h-[288px] bg-gray-800 ">
          <CoverImage coverUrl={book?.coverUrl} title={book.title}/>
        </div>

        {/* Right side: Book Info */}
        <div className="ml-6 flex-1 relative">
          <button
            onClick={onClose}
            className="absolute top-0 right-0 text-white text-2xl leading-none"
          >
            <FaTimes />
          </button>

          <h2 className="text-2xl font-semibold text-orange-400 mb-2">
            {book?.title || 'Title Unavailable'}
          </h2>

          <div className="space-y-2 text-[#d5dfff]">
            <p><span className="font-bold">Author:</span> {book?.author || 'Unknown'}</p>
            <p><span className="font-bold">Publisher:</span> {book?.publisher || 'Unknown Publisher'}</p>
            <p><span className="font-bold">Publication year:</span> {book?.editionYear || 'N/A'}</p>
            <p><span className="font-bold">ISBN:</span> {book?.isbn || 'N/A'}</p>
            <p><span className="font-bold">Department:</span> {book?.department || 'General'}</p>
            <p className="font-thin"><span className="font-bold">Description:</span> {book?.description}</p>
            <p><span className="font-bold ">Status:</span> <span className={`${book.available ? "text-green-500" : "text-red-500"}`}>{book.available ? "Available" : "Not available"}</span></p>
          </div>

          {/* Borrow Button */}
          <div className="mt-6 flex gap-6">
            <button
              onClick={() => setIsBorrowModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded"
              style={{display: (!borrowing || borrowing?.status == "RETURNED") || "none"}}
              disabled={ borrowing && borrowing?.status != "RETURNED"}
            >
              Borrow Book
            </button>
            <button
              onClick={() => {setCancel(true); setIsBorrowModalOpen(true)}}
              className="bg-red-500 hover:bg-red  -600 text-white font-semibold py-2 px-6 rounded"
              style={{display: (borrowing && borrowing?.status == "PENDING")|| "none"}}
              disabled={!borrowing || borrowing?.status != "PENDING" }
            >
              Cancel
            </button>
          </div>
          <BorrowModal isOpen={isBorrowModalOpen} book={book} onClose={() => setIsBorrowModalOpen(false)} cancel={cancel} borrowing={borrowing} />
        </div>
      </div>
    </div>
  );
}
