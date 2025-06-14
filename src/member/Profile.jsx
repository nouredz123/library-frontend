import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Person,
  Email,
  Badge,
  LibraryBooks,
  EventNote,
  MenuBook,
  AutoStories,
  LocalLibrary,
  Book,
  School
} from "@mui/icons-material";
import logoutImg from '../assets/logout.png';
import logo from '../assets/logo.png';
import BookDetailsModal from "../components/BookDetailsModal";
import { FaRegCircleCheck } from "react-icons/fa6";
import { FaCalendar } from "react-icons/fa";
import { PiWarningDiamondBold } from "react-icons/pi";
import { FaHourglassHalf } from "react-icons/fa6";
import CoverImage from "../components/CoverImage";
import toast from "react-hot-toast";


const apiUrl = import.meta.env.VITE_API_URL;

const Profile = () => {
  // State variables
  const [userInfo, setUserInfo] = useState({});
  const [borrowings, setBorrowings] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedBorrowing, setSelectedBorrowing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [activeBorrowingTab, setActiveBorrowingTab] = useState("all"); // "all", "active", "returned", "pending"



  const navigate = useNavigate();

  // Animation  after component mounts
  useEffect(() => {
    setIsPageLoaded(true);
    fetchMemberInfo();
    fetchBorrowings();
  }, [isModalOpen]);

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
      const response = await fetch(`${apiUrl}/api/member/${user?.id}/borrowings?paged=false`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${user?.token || ''}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.error) {
          throw new Error(data.error);
        }
        throw new Error();
      }
      setBorrowings(data.content);
    } catch (error) {
      console.error("Error fetching borrowings");
    }
  };

  const handleCardClick = (borrowing) => {
    setSelectedBook(borrowing?.bookCopy?.book);
    setSelectedBorrowing(borrowing);
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

  // CSS classes for animations
  const fadeInClass = isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10";

  return (
    <div className="flex justify-center w-full bg-[#101624] min-h-screen fixed inset-0 overflow-y-auto">
      <div
        className="w-full max-w-[1440px] bg-[#101624] bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/images/EXPORT-BG.png)' }}
      >
        {/* Header with subtle animation */}
        <header className={`flex flex-wrap items-center justify-between max-w-screen-xl mx-auto px-4 py-4 ${fadeInClass} transition-all duration-500`}>
          <div
            className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => navigate('/member/Dashboard')}
          >
            <div className="w-12 h-12 md:w-[60px] md:h-[56px] animate-pulse">
              <img src={logo} alt="Library Logo" className="w-12 h-12 object-cover" />
            </div>
            <div className="flex flex-col">
              <p className="text-2xl font-semibold">
                <span className="text-white">FSEI</span>
                <span className="text-[#db4402]"> Library</span>
              </p>
              <p className="text-xs text-[#d5dfff] opacity-80">Digital Catalog System</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-6 md:gap-8">
            <Link
              to="/member/Dashboard"
              className="text-[#ffffff] text-lg font-medium hover:text-[#db4402] transition-colors duration-300 relative hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#db4402] after:transition-all after:duration-300 flex items-center gap-1"
            >
              <LocalLibrary size={18} />
              Home
            </Link>
            <Link
              to="/member/Search"
              className="text-[#ffffff] text-lg font-medium hover:text-[#db4402] transition-colors duration-300 relative hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#db4402] after:transition-all after:duration-300 flex items-center gap-1"
            >
              <Book size={18} />
              Catalog Search
            </Link>
            <div className="text-[#db4402] text-lg font-medium relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#db4402] flex items-center gap-1">
              <School size={18} />
              My Account
            </div>
            <img
              src={logoutImg}
              alt="Logout"
              className="cursor-pointer hover:opacity-80 transition-opacity duration-300 hover:rotate-12 transform"
              onClick={logout}
              title="Sign Out"
            />
          </nav>
        </header>

        {/* Main Content with adjusted spacing */}
        <main className={`relative max-w-screen-xl mx-auto mt-2 px-4 py-5 ${fadeInClass} transition-all duration-700 delay-200`}>
          {/* Hero Section with library focus */}
          <div className={`text-center py-6 px-6 text-[#d5dfff] ${fadeInClass}`}>
            <div className="relative inline-block mb-2">
              <School className="text-[#db4402] text-5xl animate-bounce" />
            </div>
            <h1 className="text-5xl font-bold mb-4 relative">
              <span className="text-white">My Academic Profile</span>
              <br />
              <span className="text-[#db4402] relative text-4xl">
                Account & Borrowing History
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#db4402] animate-pulse"></span>
              </span>
            </h1>
            <p className="text-xl mt-3 max-w-3xl mx-auto">
              View your student information, track borrowed books, and manage your library account
            </p>
          </div>

          {/* Profile Container */}
          <div className="flex flex-col lg:flex-row gap-6 mt-8">
            {/* Left Column - Student Info */}
            <div className="lg:w-1/3">
              <div className="bg-[#121a2e] rounded-lg p-8 shadow-lg transform transition-all duration-500 animate-fadeIn">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Badge className="mr-2 text-[#db4402]" />
                  Student Information
                </h2>


                <div className="space-y-6">
                  <div className="bg-[#1a2238] p-4 rounded-lg border border-[#232738] hover:border-[#db4402] transition-colors duration-300">
                    <label className="text-[#a5b1c2] text-sm mb-1 block">Full Name</label>
                    <div className="flex items-center">
                      <Person className="text-[#db4402] mr-2" fontSize="small" />
                      <p className="text-[#ffffff]">{userInfo.fullName || "Loading..."}</p>
                    </div>
                  </div>

                  <div className="bg-[#1a2238] p-4 rounded-lg border border-[#232738] hover:border-[#db4402] transition-colors duration-300">
                    <label className="text-[#a5b1c2] text-sm mb-1 block">Student ID</label>
                    <div className="flex items-center">
                      <Badge className="text-[#db4402] mr-2" fontSize="small" />
                      <p className="text-[#ffffff]">{userInfo.identifier || "Loading..."}</p>
                    </div>
                  </div>

                  <div className="bg-[#1a2238] p-4 rounded-lg border border-[#232738] hover:border-[#db4402] transition-colors duration-300">
                    <label className="text-[#a5b1c2] text-sm mb-1 block">Email Address</label>
                    <div className="flex items-center">
                      <Email className="text-[#db4402] mr-2" fontSize="small" />
                      <p className="text-[#ffffff]">{userInfo.email || "Loading..."}</p>
                    </div>
                  </div>
                  {/* Account Status */}
                  <div className="bg-[#1a2238] p-4 rounded-lg border border-[#232738] hover:border-[#db4402] transition-colors duration-300">
                    <label className="text-[#a5b1c2] text-sm mb-1 block">Account Status</label>
                    <div className="flex items-center">
                      <span
                        className={`mr-2 ${userInfo.accountStatus === "APPROVED"
                          ? "text-green-500"
                          : userInfo.accountStatus === "REJECTED"
                            ? "text-red-500"
                            : "text-[#db4402]"
                          }`}
                      >
                        ●
                      </span>
                      <p
                        className={`text-sm ${userInfo.accountStatus === "APPROVED"
                          ? "text-green-500"
                          : userInfo.accountStatus === "REJECTED"
                            ? "text-red-500"
                            : "text-[#db4402]"
                          }`}
                      >
                        {userInfo.accountStatus || "Loading..."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Borrowing Stats */}
                <div className="mt-8 pt-6 border-t border-[#232738]">
                  <h3 className="text-xl text-white font-semibold mb-4 flex items-center">
                    <LibraryBooks className="mr-2 text-[#db4402]" />
                    Borrowing Summary
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#1a2238] p-3 rounded-lg border border-[#232738] text-center hover:bg-[#1f2644] transition-colors duration-300">
                      <p className="text-[#a5b1c2] text-sm">Total Books</p>
                      <p className="text-2xl font-bold text-white">{borrowingStats.all}</p>
                    </div>

                    <div className="bg-[#1a2238] p-3 rounded-lg border border-[#232738] text-center hover:bg-[#1f2644] transition-colors duration-300">
                      <p className="text-[#a5b1c2] text-sm">Currently Active</p>
                      <p className="text-2xl font-bold text-[#4caf50]">{borrowingStats.active}</p>
                    </div>

                    <div className="bg-[#1a2238] p-3 rounded-lg border border-[#232738] text-center hover:bg-[#1f2644] transition-colors duration-300">
                      <p className="text-[#a5b1c2] text-sm">Pending Pickup</p>
                      <p className="text-2xl font-bold text-[#ffb300]">{borrowingStats.pending}</p>
                    </div>

                    <div className="bg-[#1a2238] p-3 rounded-lg border border-[#232738] text-center hover:bg-[#1f2644] transition-colors duration-300">
                      <p className="text-[#a5b1c2] text-sm">Overdue</p>
                      <p className="text-2xl font-bold text-[#f44336]">{borrowingStats.overdue}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Borrowed Books */}
            <div className="lg:w-2/3">
              <div className="bg-[#121a2e] rounded-lg p-8 shadow-lg transform transition-all duration-500 animate-fadeIn">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <AutoStories className="mr-2 text-[#db4402]" />
                  Your Borrowed Books
                </h2>

                {/* Filter tabs */}
                <div className="flex flex-wrap gap-2 mb-6 bg-[#1a2238] rounded-lg p-2">
                  {['all', 'active', 'pending', 'returned'].map(tab => (
                    <button
                      key={tab}
                      className={`flex-1 min-w-[120px] py-2 px-3 text-center rounded-md transition-colors duration-300 ${activeBorrowingTab === tab
                        ? 'bg-[#db4402] text-white'
                        : 'text-[#d5dfff] hover:bg-[#232738]'
                        }`}
                      onClick={() => setActiveBorrowingTab(tab)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)} ({borrowingStats[tab]})
                    </button>
                  ))}
                </div>

                {/* Books list */}
                <div className="space-y-4 overflow-y-auto pr-2 max-h-[500px] hide-scrollbar">
                  {filteredBorrowings().length > 0 ? (
                    filteredBorrowings().map((borrowing, index) => (
                      <div
                        key={index}
                        className="flex bg-[#1a2238] rounded-lg overflow-hidden border border-[#232738] hover:border-[#db4402] transition-all duration-300 hover:shadow-md cursor-pointer transform hover:scale-[1.01] opacity-0 animate-fadeIn"
                        onClick={() => handleCardClick(borrowing)}
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animationFillMode: 'forwards'
                        }}
                      >
                        <div className="w-24 h-32 bg-[#232738] flex-shrink-0">
                          <CoverImage coverUrl={borrowing?.bookCopy?.book?.coverUrl} title={borrowing?.bookCopy?.book?.title} />
                        </div>

                        <div className="flex-1 p-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                            <h3 className="text-lg font-semibold text-white pr-4 break-words">
                              {borrowing?.bookCopy?.book?.title || 'N/A'}
                            </h3>

                            <div className={
                              borrowing?.status === "RETURNED"
                                ? "text-[#4caf50] flex items-center gap-1 flex-shrink-0"
                                : borrowing.status === "PICKED_UP"
                                  ? borrowing.returnDate && new Date(borrowing.returnDate) < new Date()
                                    ? "text-[#f44336] flex items-center gap-1 flex-shrink-0"
                                    : "text-[#ffb300] flex items-center gap-1 flex-shrink-0"
                                  : borrowing.status === "PENDING"
                                    ? "text-amber-300 flex items-center gap-1 flex-shrink-0"
                                    : "text-white flex items-center gap-1 flex-shrink-0"
                            }>
                              {borrowing?.status === "RETURNED"
                                ? <><FaRegCircleCheck size={16} /> <span>Returned</span></>
                                : borrowing?.status === "OVERDUE"
                                  ? <><PiWarningDiamondBold size={16} /> <span>Overdue</span></>
                                  : borrowing?.status === "PICKED_UP"
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
                              <span>Return: {borrowing?.returnDate ? new Date(borrowing?.returnDate).toLocaleDateString() : 'Not set'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <MenuBook style={{ fontSize: 64 }} className="text-[#232738] mb-4 animate-pulse" />
                      <h3 className="text-xl font-semibold text-white mb-2">No books found</h3>
                      <p className="text-[#a5b1c2]">
                        {activeBorrowingTab === 'all'
                          ? "You haven't borrowed any books yet. Start exploring our collections!"
                          : activeBorrowingTab === 'active'
                            ? "You don't have any active borrowings at the moment"
                            : activeBorrowingTab === 'pending'
                              ? "You don't have any pending pickups"
                              : "You don't have any returned books in your history"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Library Information Section */}
          <div className={`mt-12 bg-[#121a2e] rounded-lg p-8 ${fadeInClass} transition-all duration-700 delay-500`}>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <LibraryBooks className="mr-2 text-[#db4402]" />
              Account Guidelines & Policies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <LocalLibrary className="mr-2 text-[#db4402]" size={20} />
                  Borrowing Rules
                </h3>
                <ul className="space-y-3 text-[#d5dfff] list-disc pl-5">
                  <li>Maximum of 2 books can be borrowed simultaneously</li>
                  <li>Standard borrowing period is 1 week</li>
                  <li>Reserved books must be collected within 3 days</li>
                  <li>Late returns may result in borrowing restrictions</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Person className="mr-2 text-[#db4402]" size={20} />
                  Account Tips
                </h3>
                <ul className="space-y-3 text-[#d5dfff] list-disc pl-5">
                  <li>Check due dates regularly to avoid late fees</li>
                  <li>Use the online catalog to reserve books in advance</li>
                </ul>
              </div>
            </div>
          </div>
        </main>

        {/* Book Details Modal */}
        <BookDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          book={selectedBook}
          borrowing={selectedBorrowing}
        />
      </div>
    </div>
  );
};

// Add CSS for animations
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