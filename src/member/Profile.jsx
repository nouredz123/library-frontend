import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Person,
  Email,
  Badge,
  LibraryBooks,
  EventNote,
  MenuBook,
  AutoStories
} from "@mui/icons-material";
import logoutImg from '../assets/logout.png';
import logo from '../assets/logo.png';
import frame from '../assets/frame 165.png';
import bookNotAvailable from '../assets/book-notAvailable.jpg';
import BookDetailsModal from "../components/BookDetailsModal";
import { FaRegCircleCheck } from "react-icons/fa6";
import { FaCalendar } from "react-icons/fa";
import { PiWarningDiamondBold } from "react-icons/pi";
import { FaHourglassHalf } from "react-icons/fa6";


const apiUrl = import.meta.env.VITE_API_URL;

const Profile = () => {
  // State variables
  const [userInfo, setUserInfo] = useState({});
  const [borrowings, setBorrowings] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [activeBorrowingTab, setActiveBorrowingTab] = useState("all"); // "all", "active", "returned", "pending"



  const navigate = useNavigate();

  // Animation  after component mounts
  useEffect(() => {
    setIsPageLoaded(true);
    fetchMemberInfo();
    fetchBorrowings();
  }, []);

  const fetchMemberInfo = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const response = await fetch(`${apiUrl}/api/member/${user.id}/info`, {
        method: "GET",
        headers: {
          'Content-type': 'application/json',
          "Authorization": `Bearer ${user?.token || ''}`
        }
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("Get info failed:", error);
      } else {
        const data = await response.json();
        setUserInfo(data);
        console.log("User info fetch successful:", data);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchBorrowings = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const response = await fetch(`${apiUrl}/api/member/${user?.id}/borrowings`, {
        method: "GET",
        headers: {
          'Content-type': 'application/json',
          "Authorization": `Bearer ${user?.token || ''}`
        }
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("Get borrowings failed:", error);
      } else {
        const data = await response.json();
        setBorrowings(data);
        console.log("Borrowings fetch successful:", data);
      }
    } catch (error) {
      console.error("Error fetching borrowings:", error);
    }
  };

  const handleCardClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const filteredBorrowings = () => {
    if (activeBorrowingTab === "all") return borrowings;
    if (activeBorrowingTab === "active") return borrowings.filter(b => b.status === "PICKED_UP" || b.status === "OVERDUE");
    if (activeBorrowingTab === "returned") return borrowings.filter(b => b.status === "RETURNED");
    if (activeBorrowingTab === "pending") return borrowings.filter(b => b.status === "PENDING");
    return borrowings;
  };

  const borrowingStats = {
    all: borrowings.length,
    active: borrowings.filter(b => b.status === "PICKED_UP").length,
    returned: borrowings.filter(b => b.status === "RETURNED").length,
    pending: borrowings.filter(b => b.status === "PENDING").length,
    overdue: borrowings.filter(b => b.status === "OVERDUE").length
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/sign-in", { replace: true });
    console.log('Logging out...');
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  };

  //  CSS  for animations
  const fadeInClass = isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10";

  return (
    <div className="flex justify-center w-full bg-[#101624] min-h-screen">
      <div
        className="w-full max-w-[1440px] bg-[#101624] bg-cover bg-center pb-10 transition-all duration-700 ease-out"
        style={{ backgroundImage: 'url(/assets/images/EXPORT-BG.png)' }}
      >
        {/* Header with subtle animation */}
        <header className={`flex items-center justify-between w-[1240px] mx-auto py-4 ${fadeInClass} transition-all duration-500`}>
          <div
            className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => navigate('/member/Dashboard')}
          >
            <div className="w-[60px] h-[56px] animate-pulse">
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <p className="text-2xl font-semibold">
              <span className="text-white">Book</span>
              <span className="text-[#db4402]">FSEI</span>
            </p>
          </div>
          <nav className="flex items-center gap-8">
            <Link
              to="/member/Dashboard"
              className="text-[#d5dfff] text-lg font-medium hover:text-[#db4402] transition-colors duration-300 relative hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#db4402] after:transition-all after:duration-300"
            >
              Home
            </Link>
            <Link
              to="/member/Search"
              className="text-[#d5dfff] text-lg font-medium hover:text-[#db4402] transition-colors duration-300 relative hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#db4402] after:transition-all after:duration-300"
            >
              Search
            </Link>
            <div className="text-[#db4402] text-lg font-medium relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#db4402]">
              Profile
            </div>
            <img
              src={logoutImg}
              alt="Logout"
              className="cursor-pointer hover:opacity-80 transition-opacity duration-300 hover:rotate-12 transform"
              onClick={logout}
            />
          </nav>
        </header>

        {/* Profile Hero Section */}
        <div className={`text-center py-6 px-6 text-[#d5dfff] ${fadeInClass} transition-all duration-700 delay-100`}>
          <div className="relative inline-block mb-2">
            <Person className="text-[#db4402] text-5xl animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold mb-2 relative">
            Student Profile
            <span className="absolute -bottom-1 left-1/4 right-1/4 h-0.5 bg-[#db4402] animate-pulse"></span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-[#a5b1c2]">
            Manage your account information and track your borrowed books
          </p>
        </div>

        {/* Main Content */}
        <div className={`max-w-[1160px] mx-auto mt-4 ${fadeInClass} transition-all duration-700 delay-200`}>
          {/* Profile Container */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column - Student Info */}
            <div className="md:w-1/3 bg-[#121a2e] rounded-lg shadow-lg transform transition-all duration-500 hover:shadow-[0_0_15px_rgba(219,68,2,0.3)] border border-[#232738]">
              <div className="p-6 relative">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#db4402] rounded-full p-3 shadow-lg border-4 border-[#121a2e]">
                  <Person className="text-white text-3xl" />
                </div>

                <h2 className="text-2xl text-white font-bold text-center mt-6 mb-6 flex items-center justify-center">
                  <Badge className="mr-2 text-[#db4402]" />
                  Student Information
                </h2>

                <div className="space-y-6">
                  <div className="bg-[#1a2238] p-4 rounded-lg border border-[#232738] hover:border-[#db4402] transition-colors duration-300 group">
                    <label className="text-[#a5b1c2] text-sm mb-1 block group-hover:text-[#db4402] transition-colors duration-300">Full Name</label>
                    <div className="flex items-center">
                      <Person className="text-[#db4402] mr-2" fontSize="small" />
                      <p className="text-[#ffffff] ">{userInfo.fullName || "Loading..."}</p>
                    </div>
                  </div>

                  <div className="bg-[#1a2238] p-4 rounded-lg border border-[#232738] hover:border-[#db4402] transition-colors duration-300 group">
                    <label className="text-[#a5b1c2] text-sm mb-1 block group-hover:text-[#db4402] transition-colors duration-300">Student ID</label>
                    <div className="flex items-center">
                      <Badge className="text-[#db4402] mr-2" fontSize="small" />
                      <p className="text-[#ffffff] ">{userInfo.identifier || "Loading..."}</p>
                    </div>
                  </div>

                  <div className="bg-[#1a2238] p-4 rounded-lg border border-[#232738] hover:border-[#db4402] transition-colors duration-300 group">
                    <label className="text-[#a5b1c2] text-sm mb-1 block group-hover:text-[#db4402] transition-colors duration-300">Email Address</label>
                    <div className="flex items-center">
                      <Email className="text-[#db4402] mr-2" fontSize="small" />
                      <p className="text-[#ffffff] ">{userInfo.email || "Loading..."}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Borrowing Stats */}
              <div className="border-t border-[#232738] p-6">
                <h3 className="text-xl text-white font-semibold mb-4 flex items-center">
                  <LibraryBooks className="mr-2 text-[#db4402]" />
                  Borrowing Summary
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#1a2238] p-3 rounded-lg border border-[#232738] text-center">
                    <p className="text-[#a5b1c2] text-sm">Total</p>
                    <p className="text-2xl font-bold text-white">{borrowingStats.all}</p>
                  </div>

                  <div className="bg-[#1a2238] p-3 rounded-lg border border-[#232738] text-center">
                    <p className="text-[#a5b1c2] text-sm">Active</p>
                    <p className="text-2xl font-bold text-[#4caf50]">{borrowingStats.active}</p>
                  </div>

                  <div className="bg-[#1a2238] p-3 rounded-lg border border-[#232738] text-center">
                    <p className="text-[#a5b1c2] text-sm">Pending</p>
                    <p className="text-2xl font-bold text-[#ffb300]">{borrowingStats.pending}</p>
                  </div>

                  <div className="bg-[#1a2238] p-3 rounded-lg border border-[#232738] text-center">
                    <p className="text-[#a5b1c2] text-sm">Overdue</p>
                    <p className="text-2xl font-bold text-[#f44336]">{borrowingStats.overdue}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Borrowed Books */}
            <div className="md:w-2/3 bg-[#121a2e] rounded-lg shadow-lg border border-[#232738]">
              <div className="p-6">
                <h2 className="text-2xl text-white font-bold mb-6 flex items-center">
                  <AutoStories className="mr-2 text-[#db4402]" />
                  Your Borrowed Books
                </h2>

                {/* Filter tabs */}
                <div className="flex mb-6 bg-[#1a2238] rounded-lg overflow-hidden">
                  <button
                    className={`flex-1 py-3 text-center transition-colors duration-300 ${activeBorrowingTab === 'all' ? 'bg-[#db4402] text-white' : 'text-[#d5dfff] hover:bg-[#232738]'}`}
                    onClick={() => setActiveBorrowingTab('all')}
                  >
                    All ({borrowingStats.all})
                  </button>
                  <button
                    className={`flex-1 py-3 text-center transition-colors duration-300 ${activeBorrowingTab === 'active' ? 'bg-[#db4402] text-white' : 'text-[#d5dfff] hover:bg-[#232738]'}`}
                    onClick={() => setActiveBorrowingTab('active')}
                  >
                    Active ({borrowingStats.active})
                  </button>
                  <button
                    className={`flex-1 py-3 text-center transition-colors duration-300 ${activeBorrowingTab === 'pending' ? 'bg-[#db4402] text-white' : 'text-[#d5dfff] hover:bg-[#232738]'}`}
                    onClick={() => setActiveBorrowingTab('pending')}
                  >
                    Pending ({borrowingStats.pending})
                  </button>
                  <button
                    className={`flex-1 py-3 text-center transition-colors duration-300 ${activeBorrowingTab === 'returned' ? 'bg-[#db4402] text-white' : 'text-[#d5dfff] hover:bg-[#232738]'}`}
                    onClick={() => setActiveBorrowingTab('returned')}
                  >
                    Returned ({borrowingStats.returned})
                  </button>
                </div>

                {/* Books list */}
                <div className="space-y-4 overflow-y-auto pr-2 max-h-[500px] hide-scrollbar">
                  {filteredBorrowings().length > 0 ? (
                    filteredBorrowings().map((borrowing, index) => (
                      <div
                        key={index}
                        className="flex bg-[#1a2238] rounded-lg overflow-hidden border border-[#232738] hover:border-[#db4402] transition-all duration-300 hover:shadow-md cursor-pointer transform hover:scale-[1.01] opacity-0 animate-fadeIn"
                        onClick={() => handleCardClick(borrowing?.bookCopy?.book)}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="w-24 h-32 bg-[#232738] flex-shrink-0">
                          <img
                            src={borrowing?.bookCopy?.book?.coverUrl || '/assets/images/book.png'}
                            alt="Book Cover"
                            className="w-full h-full object-cover"
                            onError={(e) => e.target.src = bookNotAvailable}
                          />
                        </div>

                        <div className="flex-1 p-4">
                          <div className="flex justify-between">
                            <h3 className="text-lg font-semibold text-white truncate pr-4">
                              {borrowing?.bookCopy?.book?.title || 'N/A'}
                            </h3>

                            <div className={
                              borrowing.status === "RETURNED"
                                ? "text-[#4caf50] flex items-center gap-1"
                                : borrowing.status === "PICKED_UP"
                                  ? borrowing.returnDate && new Date(borrowing.returnDate) < new Date()
                                    ? "text-[#f44336] flex items-center gap-1"
                                    : "text-[#ffb300] flex items-center gap-1"
                                  : borrowing.status === "PENDING"
                                    ? "text-amber-300 flex items-center gap-1"
                                    : "text-white flex items-center gap-1"
                            }>
                              {borrowing.status === "RETURNED"
                                ? <><FaRegCircleCheck size={16} /> <span>Returned</span></>
                                : borrowing.status === "OVERDUE"
                                  ? <><PiWarningDiamondBold size={16} /> <span>Overdue</span></>
                                  : borrowing.status === "PICKED_UP"
                                    ? <><FaCalendar size={16} /> <span>{Math.ceil(
                                      (new Date(borrowing.returnDate) - new Date()) / (1000 * 60 * 60 * 24)
                                    )} day(s) left</span></>
                                    : borrowing.status === "PENDING"
                                      ? <><FaHourglassHalf size={16} /> <span>Pending pickup</span></>
                                      : borrowing.status}
                            </div>
                          </div>

                          <p className="text-[#a5b1c2] mt-1">
                            By {borrowing?.bookCopy?.book?.author || 'Unknown'} • {borrowing?.bookCopy?.book?.department || 'General'}
                          </p>

                          <div className="flex justify-between mt-3 text-sm">
                            <div className="flex items-center text-[#d5dfff]">
                              <EventNote className="mr-1 text-[#db4402]" fontSize="small" />
                              <span>Pickup: {new Date(borrowing?.pickUpDate).toLocaleDateString()}</span>
                            </div>

                            <div className="flex items-center text-[#d5dfff]">
                              <EventNote className="mr-1 text-[#db4402]" fontSize="small" />
                              <span>Return: {borrowing?.returnDate ? new Date(borrowing.returnDate).toLocaleDateString() : 'Not set'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <MenuBook style={{ fontSize: 64 }} className="text-[#232738] mb-4" />
                      <p className="text-[#a5b1c2] text-lg">
                        {activeBorrowingTab === 'all'
                          ? "You haven't borrowed any books yet"
                          : activeBorrowingTab === 'active'
                            ? "You don't have any active borrowings"
                            : activeBorrowingTab === 'pending'
                              ? "You don't have any pending pickups"
                              : "You don't have any returned books"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Book Details Modal */}
        <BookDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          book={selectedBook}
        />
      </div>
    </div>
  );
};

// Add  CSS for animations
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
  
  .hide-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .hide-scrollbar::-webkit-scrollbar-track {
    background: #1a2238;
    border-radius: 10px;
  }
  
  .hide-scrollbar::-webkit-scrollbar-thumb {
    background: #232738;
    border-radius: 10px;
  }
  
  .hide-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #db4402;
  }
`;
document.head.appendChild(style);

export default Profile;