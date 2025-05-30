import {
  ArrowLeft,
  Book,
  ChevronLeft,
  ChevronRight,
  Logout,
  LocalLibrary,
  MenuBook,
  AutoStories,
  Bookmark,
  LibraryBooks,
  Schedule,
  Info,
  School,
} from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { departments } from "../constants";
import logoutImg from "../assets/logout.png";
import logo from "../assets/logo.png";
import toast from "react-hot-toast";
import BookCard from "../components/BookCard";
import BookDetailsModal from "../components/BookDetailsModal";
import BorrowModal from "../components/BorrowModal";
import Pagination from "../components/Pagination";

const apiUrl = import.meta.env.VITE_API_URL;
export default function Dashboard() {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);

  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [borrowModalBook, setBorrowModalBook] = useState(null);

  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCardClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const navigate = useNavigate();

  // Animation effect after component mounts
  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  // Reset page when department changes
  useEffect(() => {
    if (selectedDepartment && currentPage !== 0) {
      setCurrentPage(0);
    } else if (selectedDepartment) {
      fetchBooksByDepartment(selectedDepartment, currentPage);
    }
  }, [selectedDepartment]);

  // Fetch books when page changes
  useEffect(() => {
    if (selectedDepartment) {
      fetchBooksByDepartment(selectedDepartment, currentPage);
    }
  }, [currentPage]);

  const borrow = async (bookId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("token:", user.token);
    try {
      const response = await fetch(`${apiUrl}/api/member/borrow`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          bookId,
          memberId: user.id,
          pickupDate: "2025-01-01",
          returnDate: "2525-09-09",
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      const data = await response.json();
      toast.success("Book borrowed successfully! Please collect from the library desk.");
      console.log("Borrow successful:", data);
    } catch (error) {
      toast.error(error.message);
      console.log("Error:", error.message);
    }
  };

  // Function to fetch books by department with pagination
  const fetchBooksByDepartment = async (department, page = 0) => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("token:", user?.token);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${apiUrl}/api/member/books?department=${department}&page=${page}&size=8`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            'Authorization': `Bearer ${user?.token || ""}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        if (data.error) {
          toast.error(data.error);
          return;
        } else {
          throw new Error(`Failed to fetch ${department} collection`);
        }
      }

      const data = await response.json();
      console.log(data);
      setBooks(data.content || []);
      setTotalPages(data.totalPages);
      setTotalBooks(data.totalElements);
      setSelectedDepartment(department);
    } catch (error) {
      console.log(`Error fetching ${department} collection:`, error);
      setError(`Failed to load library collection: ${error.message}`);
      toast.error("Failed to load books from library catalog. Please try again later.");
      setBooks([]);
      setTotalPages(0);
      setTotalBooks(0);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/sign-in", { replace: true });
    console.log("Logging out...");
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  };

  //  CSS classes for animations
  const fadeInClass = isPageLoaded
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-10";
  const staggeredDelay = (index) =>
    `transition-all duration-700 ease-out delay-${index * 200}`;

  return (
    <div className="flex justify-center w-full bg-[#101624] min-h-screen fixed inset-0 overflow-y-auto">
      <div
        className="w-full max-w-[1440px] bg-[#101624] bg-cover bg-center"
        style={{ backgroundImage: "url(/assets/images/EXPORT-BG.png)" }}
      >
        {/* Header with subtle animation */}
        <header className={`flex flex-wrap items-center justify-between max-w-screen-xl mx-auto px-4 py-4 ${fadeInClass} transition-all duration-500`}>

          <div
            className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => navigate("/member/Dashboard")}
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
            <div className="text-[#db4402] text-lg font-medium relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#db4402] flex items-center gap-1">
              <LocalLibrary size={18} />
              Home
            </div>
            <Link
              to="/member/Search"
              className="text-[#ffffff] text-lg font-medium hover:text-[#db4402] transition-colors duration-300 relative hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#db4402] after:transition-all after:duration-300 flex items-center gap-1"
            >
              <Book size={18} />
              Catalog Search
            </Link>
            <Link
              to="/member/Profile"
              className="text-[#ffffff] text-lg font-medium hover:text-[#db4402] transition-colors duration-300 relative hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#db4402] after:transition-all after:duration-300 flex items-center gap-1"
            >
              <School size={18} />
              My Account
            </Link>
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
          <>
            {/* Hero Section with library focus */}
            <div
              className={`text-center py-6 px-6 text-[#d5dfff] ${fadeInClass}`}
            >
              <div className="relative inline-block mb-2">
                <LocalLibrary className="text-[#db4402] text-5xl animate-bounce" />
              </div>
              <h1 className="text-5xl font-bold mb-4 relative">
                <span className="text-white">FSEI Academic Library</span>
                <br />
                <span className="text-[#db4402] relative text-4xl">
                  Digital Catalog & Borrowing System
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#db4402] animate-pulse"></span>
                </span>
              </h1>
              <p className="text-xl mt-3 max-w-3xl mx-auto">
                Discover, reserve, and borrow academic resources from our comprehensive collection
                spanning Computer Science, Mathematics, Physics, and Chemistry
              </p>

              {/* Library Stats */}
              <div className="flex justify-center gap-8 mt-8 flex-wrap">
                <div className="bg-[#121a2e]/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#db4402]">2,500+</div>
                  <div className="text-sm text-[#d5dfff]">Books Available</div>
                </div>
                <div className="bg-[#121a2e]/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#db4402]">4</div>
                  <div className="text-sm text-[#d5dfff]">Departments</div>
                </div>
                <div className="bg-[#121a2e]/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#db4402]">24/7</div>
                  <div className="text-sm text-[#d5dfff]">Online Access</div>
                </div>
              </div>
            </div>

            {/* Subject Cards with staggered animation */}
            <h2
              className={`text-2xl font-bold text-white mb-4 flex items-center ${fadeInClass} transition-all duration-700 delay-400`}
            >
              <LibraryBooks className="mr-2 text-[#db4402]" />
              Browse Library Collections by Department
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
              {departments.map((dept, index) => (
                <div
                  key={dept.id}
                  className={`bg-[#121a2e] rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-500 shadow-lg border border-transparent hover:border-[#db4402]/30 opacity-0 animate-fadeIn`}
                  style={{
                    animationDelay: `${index * 200}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={dept.image}
                      alt={`${dept.title} Collection`}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4">
                      <h3 className="text-xl font-bold text-white">
                        {dept.title}
                      </h3>
                      <p className="text-sm text-[#d5dfff] opacity-90">Academic Collection</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-[#d5dfff] mb-4 h-12">{dept.tagline}</p>
                    <button
                      className="w-full bg-[#db4402] text-white py-2 px-4 rounded-md hover:bg-[#c23a02] transition-colors duration-300 flex items-center justify-center gap-2 group"
                      onClick={() => {
                        setCurrentPage(0);
                        navigate("/member/Search", {
                          state: { selectedDepartment: dept.title },
                        });
                      }}
                    >
                      <Book size={16} />
                      Browse Collection
                      <ChevronRight className="group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Access Section */}
            <div className={`mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 ${fadeInClass} transition-all duration-700 delay-600`}>
              <div className="bg-[#121a2e] rounded-lg p-6 hover:bg-[#1a2540] transition-colors duration-300">
                <div className="flex items-center mb-4">
                  <Book className="text-[#db4402] mr-3" size={24} />
                  <h3 className="text-lg font-semibold text-white">Search Catalog</h3>
                </div>
                <p className="text-[#d5dfff] mb-4">
                  Find specific books, authors, or topics across all our collections
                </p>
                <Link
                  to="/member/Search"
                  className="text-[#db4402] hover:text-[#c23a02] font-medium flex items-center gap-1"
                >
                  Search Now <ChevronRight size={16} />
                </Link>
              </div>

              <div className="bg-[#121a2e] rounded-lg p-6 hover:bg-[#1a2540] transition-colors duration-300">
                <div className="flex items-center mb-4">
                  <Schedule className="text-[#db4402] mr-3" size={24} />
                  <h3 className="text-lg font-semibold text-white">My Borrowings</h3>
                </div>
                <p className="text-[#d5dfff] mb-4">
                  View your borrowed books, due dates, and borrowing history
                </p>
                <Link
                  to="/member/Profile"
                  className="text-[#db4402] hover:text-[#c23a02] font-medium flex items-center gap-1"
                >
                  View Account <ChevronRight size={16} />
                </Link>
              </div>


            </div>
          </>
          <div
            className={`mt-20 bg-[#121a2e] rounded-lg p-8 ${fadeInClass} transition-all duration-700 delay-500`}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Schedule className="mr-2 text-[#db4402]" />
              Library Services & Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <LocalLibrary className="mr-2 text-[#db4402]" size={20} />
                  Library Hours
                </h3>
                <ul className="space-y-4 text-[#d5dfff]">
                  <li className="flex justify-between">
                    <span>Sunday - Thursday</span>
                    <div className="text-right">
                      <div>8:30 AM - 12:30 PM</div>
                      <div>1:30 PM - 3:00 PM</div>
                    </div>
                  </li>
                  <li className="flex justify-between">
                    <span>Friday - Saturday</span>
                    <span>Closed</span>
                  </li>
                </ul>
                <div className="mt-4 p-3 bg-[#db4402]/10 rounded border-l-4 border-[#db4402]">
                  <p className="text-sm text-[#d5dfff]">
                    <strong>Note:</strong> Online catalog is available 24/7 for browsing and reservations
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Bookmark className="mr-2 text-[#db4402]" size={20} />
                  Borrowing Policies
                </h3>
                <ul className="space-y-4 text-[#d5dfff] list-disc pl-5">
                  <li>
                    Book reservations expire after 3 days if not collected from library desk
                  </li>
                  <li>Standard borrowing period is 1 week (renewable once if no holds)</li>
                  <li>Maximum of 2 books can be borrowed simultaneously per student</li>
                </ul>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Library Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#d5dfff]">
                <div>
                  <strong className="text-white ">Location:</strong><br />
                  <span className="text-sm">
                    Bibliothèque Centrale<br />
                    Avenue Hamadou Hossine, Mostaganem<br />
                    27000 MOSTAGANEM<br />
                    Algerie
                  </span>
                </div>
                <div>
                  <strong className="text-white ">Contact:</strong><br />
                  <span className="text-sm">
                    Phone: 045 41 69 34<br />
                    Email: bcmunivmosta@gmail.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// CSS for animations
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
    display: none;
  }
  
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
document.head.appendChild(style);