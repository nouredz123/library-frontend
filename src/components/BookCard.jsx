import { useState } from "react";
import BookDetailsModal from '../components/BookDetailsModal';
import bookNotAvailable from '../assets/book-notAvailable.jpg';
import toast from "react-hot-toast";
import { Book } from "@mui/icons-material";

export default function BookCard ({ book }) {
    const [selectedBook, setSelectedBook] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleCardClick = (book) => {
      setSelectedBook(book);
      setIsModalOpen(true);
    };
     const borrow = async (bookId) => {
        const user = JSON.parse(localStorage.getItem("user"));
        try {
          const response = await fetch("http://localhost:8080/api/member/borrow",{
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
              'Authorization' : `Bearer ${user.token}`
            },
            body: JSON.stringify({
              bookId,
              memberId: user.id,
              pickupDate: "2025-01-01",
              returnDate: "2525-09-09"
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
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
    <div className="h-48 bg-gray-700 flex items-center justify-center">
      {book.coverUrl ? (
        <img src={book.coverUrl} alt={book.title} className="h-full object-cover" 
          onError={(e) => e.target.src = bookNotAvailable} 
        />
      ) : (
        <Book size={64} className="text-gray-500" />
      )}
    </div>
    <div className="p-4">
      <h3 className="text-lg font-bold truncate text-white">{book.title}</h3>
      <p className="text-gray-400 text-sm mb-2">By {book.author || 'Unknown'}</p>
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex justify-between items-center">
          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
            {book.editionYear || 'N/A'}
          </span>
          <div className={`text-xs ${book.available ? "text-green-500" : "text-red-500"}`}>{book.available ? "Available" : "Not available"}</div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <button className="bg-red-600 text-white text-sm py-1 px-3 rounded hover:bg-red-700 transition"
            onClick={()=>handleCardClick(book)}
          >
            View Details
          </button>
          <button 
            className="bg-blue-600 text-white text-sm py-1 px-3 rounded hover:bg-blue-700 transition"
            onClick={()=> borrow(book.id)}
          >
            Borrow
          </button>
        </div>
        <BookDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} book={book}/>
      </div>
    </div>
  </div>
  );}