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
} from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { departments } from "../constants";
import logoutImg from "../assets/logout.png";
import logo from "../assets/logo.png";
import toast from "react-hot-toast";
import BookCard from "../components/BookCard";

export default function Dashboard() {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const navigate = useNavigate();

  // Animation effect after component mounts
  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  const borrow = async (bookId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("token:", user.token);
    try {
      const response = await fetch("http://localhost:8080/api/member/borrow", {
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
      toast.success("Borrowings done successfully");
      console.log("Borrow successful:", data);
    } catch (error) {
      toast.error(error.message);
      console.log("Error:", error.message);
    }
  };

  // Function to fetch books by department
  const fetchBooksByDepartment = async (department) => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("token:", user?.token);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8080/api/member/books?department=${department}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user?.token || ""}`,
          },
        }
      );

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
    <div className="flex justify-center w-full bg-[#101624] min-h-screen">
      <div
    className="w-full max-w-[1440px] bg-[#101624] bg-cover bg-center"
        style={{ backgroundImage: "url(/assets/images/EXPORT-BG.png)" }}
      >
        {/* Header with subtle animation */}
        <header
          className={`flex items-center justify-between w-[1240px] mx-auto py-4 ${fadeInClass} transition-all duration-500`}
        >
          <div
            className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => navigate("/member/Dashboard")}
          >
            <div className="w-[60px] h-[56px] animate-pulse">
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-2xl font-semibold">
              <span className="text-white">Book</span>
              <span className="text-[#db4402]">FSEI</span>
            </p>
          </div>
          <nav className="flex items-center gap-8">
            <div className="text-[#db4402] text-lg font-medium relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#db4402]">
              Home
            </div>
            <Link
              to="/member/Search"
              className="text-[#d5dfff] text-lg font-medium hover:text-[#db4402] transition-colors duration-300 relative hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#db4402] after:transition-all after:duration-300"
            >
              Search
            </Link>
            <Link
              to="/member/Profile"
              className="text-[#d5dfff] text-lg font-medium hover:text-[#db4402] transition-colors duration-300 relative hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#db4402] after:transition-all after:duration-300"
            >
              Profile
            </Link>
            <img
              src={logoutImg}
              alt="Logout"
              className="cursor-pointer hover:opacity-80 transition-opacity duration-300 hover:rotate-12 transform"
              onClick={logout}
            />
          </nav>
        </header>

        {/* Main Content with adjusted spacing */}
        <main
          className={`max-w-[1160px] mx-auto mt-2 p-5 ${fadeInClass} transition-all duration-700 delay-200`}
        >
          {selectedDepartment ? (
            // Department Books View with animations
            <div className="bg-[#121a2e] rounded-lg p-8 shadow-lg transform transition-all duration-500 animate-fadeIn">
              <div className="flex items-center mb-8">
                <button
                  className="flex items-center text-[#d5dfff] hover:text-[#db4402] mr-4 transition-colors duration-300 group"
                  onClick={() => setSelectedDepartment(null)}
                >
                  <ArrowLeft
                    size={20}
                    className="mr-1 group-hover:-translate-x-1 transition-transform duration-300"
                  />
                  Back
                </button>
                <h1 className="text-3xl font-bold text-white flex items-center">
                  <LocalLibrary className="mr-2 text-[#db4402]" />
                  {
                    departments.find((d) => d.id === selectedDepartment)?.title
                  }{" "}
                  Books
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
                  <Book
                    size={64}
                    className="mx-auto text-gray-600 mb-4 animate-pulse"
                  />
                  <h3 className="text-xl font-semibold">No books found</h3>
                  <p className="text-gray-400">
                    No books are currently available in this category.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                  {books.map((book, index) => (
                    <div
                      key={book.id}
                      className={`transform transition-all duration-500 delay-${
                        index * 100
                      } animate-fadeIn hover:scale-105`}
                    >
                      <BookCard book={book} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Home View with animations
            <>
              {/* Hero Section with book animation  */}
              <div
                className={`text-center py-6 px-6 text-[#d5dfff] ${fadeInClass}`}
              >
                <div className="relative inline-block mb-2">
                  <MenuBook className="text-[#db4402] text-5xl animate-bounce" />
                </div>
                <h1 className="text-5xl font-bold mb-4 relative">
                  Welcome to the Official
                  <br />
                  Library Portal of{" "}
                  <span className="text-[#db4402] relative">
                    FSEI
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#db4402] animate-pulse"></span>
                  </span>
                </h1>
                <p className="text-xl mt-3 max-w-2xl mx-auto">
                  Access curated content tailored to Computer Science, Math,
                  Physics, and Chemistry students
                </p>
              </div>


              {/* Subject Cards with staggered animation */}
              <h2
                className={`text-2xl font-bold text-white mb-4 flex items-center ${fadeInClass} transition-all duration-700 delay-400`}
              >
                <Bookmark className="mr-2 text-[#db4402]" />
                Browse by Department
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
                        alt={dept.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-4">
                        <h3 className="text-xl font-bold text-white">
                          {dept.title}
                        </h3>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-[#d5dfff] mb-4 h-12">{dept.tagline}</p>
                      <button
                        className="w-full bg-[#db4402] text-white py-2 px-4 rounded-md hover:bg-[#c23a02] transition-colors duration-300 flex items-center justify-center gap-2 group"
                        onClick={() => fetchBooksByDepartment(dept.id)}
                      >
                        Browse
                        <ChevronRight className="group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!selectedDepartment && (
            <div
              className={`mt-20 bg-[#121a2e] rounded-lg p-8 ${fadeInClass} transition-all duration-700 delay-500`}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <LocalLibrary className="mr-2 text-[#db4402]" />
                Library Hours & Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Opening Hours
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
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Library Rules
                  </h3>
                  <ul className="space-y-4 text-[#d5dfff] list-disc pl-5">
                    <li>
                      Book reservations expire after 3 days if not picked up
                    </li>
                    <li>Maximum borrowing duration is 1 week</li>
                    <li>Maximum of 2 books can be borrowed at a time</li>
                    <li>Books must be returned by the due date</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
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
