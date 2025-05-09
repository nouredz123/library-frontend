import { ArrowLeft, Book, ChevronLeft, ChevronRight, Logout } from '@mui/icons-material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { departments } from '../constants';
import logoutImg from '../assets/logout.png';
import logo from '../assets/logo.png';
import toast from 'react-hot-toast';
import BookCard from '../components/BookCard';

export default function Dashboard() {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
    
  const navigate = useNavigate();

  

  const borrow = async (bookId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("token:", user.token);
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

  // Function to fetch books by department
  const fetchBooksByDepartment = async (department) => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("token:", user?.token);
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8080/api/member/books?department=${department}`, {
        method: "GET",
        headers: {
          'Content-type': 'application/json',
          "Authorization": `Bearer ${user?.token || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${department} books`);
      }
      
      const data = await response.json();
      setBooks(data._embedded?.bookList || []);
      setSelectedDepartment(department);
      
    } catch (error) {
      console.log(`Error fetching ${department} books:`, error);
      setError(`Failed to load books: ${error.message}`);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };
  const logout = ()=>{
    localStorage.removeItem("user");
    navigate("/sign-in",{replace: true});
    console.log('Logging out...');
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function() {
      window.history.pushState(null, "", window.location.href);
    };
  }
  

  return (
    <div className="flex justify-center w-full bg-[#101624] min-h-screen">
      <div className="w-full max-w-[1440px] bg-[#101624] bg-cover bg-center pb-24" style={{ backgroundImage: 'url(/assets/images/EXPORT-BG.png)' }}>
        {/* Header */}
        <header className="flex items-center justify-between w-[1240px] mx-auto py-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/member/Dashboard')}>
            <div className="w-[60px] h-[56px]">
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <p className="text-2xl font-semibold">
              <span className="text-white">Book</span>
              <span className="text-[#db4402]">FSEI</span>
            </p>
          </div>
          <nav className="flex items-center gap-8">
            <div className="text-[#db4402] text-lg font-medium">Home</div>
            <Link to="/member/Search" className="text-[#d5dfff] text-lg font-medium hover:text-[#db4402] transition">Search</Link>
            <Link to="/member/Profile" className="text-[#d5dfff] text-lg font-medium hover:text-[#db4402] transition">Profile</Link>
            <img src={logoutImg} alt="Logout" className="cursor-pointer hover:opacity-80 transition" onClick={logout}/>
          </nav>
        </header>

        {/* Main Content */}
        <main className="max-w-[1160px] mx-auto my-10 p-5">
          {selectedDepartment ? (
            // Department Books View
            <div className="bg-[#121a2e] rounded-lg p-8">
              <div className="flex items-center mb-8">
                <button 
                  className="flex items-center text-[#d5dfff] hover:text-[#db4402] mr-4 transition"
                  onClick={() => setSelectedDepartment(null)}
                >
                  <ArrowLeft size={20} className="mr-1" />
                  Back
                </button>
                <h1 className="text-3xl font-bold text-white">
                  {departments.find(d => d.id === selectedDepartment)?.title} Books
                </h1>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#db4402]"></div>
                </div>
              ) : error ? (
                <div className="bg-red-900/30 border border-red-800 text-white p-4 rounded-md">
                  {error}
                </div>
              ) : books.length === 0 ? (
                <div className="text-center py-16 text-[#d5dfff]">
                  <Book size={64} className="mx-auto text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold">No books found</h3>
                  <p className="text-gray-400">No books are currently available in this category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                  {books.map((book) => (
                    <BookCard key={book.id} book={book}/>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Home View
            <>
              {/* Hero Section */}
              <div className="text-center py-16 px-6 text-[#d5dfff]">
                <h1 className="text-5xl font-bold mb-4">
                  Welcome to the Official<br />
                  Library Portal of <span className="text-[#db4402]">FSEI</span>
                </h1>
                <p className="text-xl mt-6 max-w-2xl mx-auto">
                  Access curated content tailored to Computer Science, Math, Physics, and Chemistry students
                </p>
              </div>

              {/* Subject Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {departments.map((dept) => (
                  <div key={dept.id} className="bg-[#121a2e] rounded-lg overflow-hidden hover:transform hover:scale-105 transition">
                    <img src={dept.image} alt={dept.title} className="w-full h-48 object-cover"/>
                    <div className="p-4 h-24">
                      <h3 className="text-xl font-bold text-white">{dept.title}</h3>
                      <p className="text-[#d5dfff] mb-4">{dept.tagline}</p>
                    </div>
                    <div className='p-4'>
                      <button 
                        className="w-full bg-[#db4402] text-white py-2 px-4 rounded-md hover:bg-[#c23a02] transition"
                        onClick={() => fetchBooksByDepartment(dept.id)}
                      >
                        Browse
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

