import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search as SearchIcon, Book, MenuBook, FilterList, Clear, ChevronRight, ArrowUpward, ArrowDownward, LocalLibrary, LibraryBooks, School } from '@mui/icons-material';
import logoutImg from '../assets/logout.png';
import logo from '../assets/logo.png';
import toast from 'react-hot-toast';
import BookCard from '../components/BookCard';
import Pagination from '../components/Pagination';
import BookDetailsModal from '../components/BookDetailsModal';
import BorrowModal from '../components/BorrowModal';

const apiUrl = import.meta.env.VITE_API_URL;

export default function Search() {
    const [searchQuery, setSearchQuery] = useState('');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBooks, setTotalBooks] = useState(null);
    const location = useLocation();

    const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
    const [borrowModalBook, setBorrowModalBook] = useState(null);

    const [selectedBook, setSelectedBook] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleCardClick = (book) => {
        setSelectedBook(book);
        setIsModalOpen(true);
    };

    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const [searchType, setSearchType] = useState('all'); // 'title', 'author', 'isbn'
    const [availabilityFilter, setAvailabilityFilter] = useState('all'); // 'available', 'unavailable', 'all'
    const [sortBy, setSortBy] = useState('title'); // 'title', 'publicationYear'
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [sortDirection, setSortDirection] = useState('asc'); // 'asc', 'desc'

    const navigate = useNavigate();
    const [shouldSearch, setShouldSearch] = useState(false);

    // Animation effect after component mounts
    useEffect(() => {
        setIsPageLoaded(true);
    }, []);

    useEffect(() => {
        if (location.state?.selectedDepartment) {
            setSelectedDepartment(location.state.selectedDepartment);
            const element = document.getElementById("search-sec");
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        }
    }, [location.state]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setShouldSearch(true);
        }
    }, [searchQuery]);

    useEffect(() => {
        if (currentPage !== 0) {
            setCurrentPage(0);
        } else {
            setShouldSearch(true);
        }
    }, [availabilityFilter, sortBy, sortDirection, selectedDepartment]);

    useEffect(() => {
        setShouldSearch(true);
    }, [currentPage]);

    useEffect(() => {
        if (shouldSearch) {
            handleSearch();
            setShouldSearch(false);
        }
    }, [shouldSearch]);

    const handleSearch = async (dp = "nodp") => {
        console.log(dp);
        const user = JSON.parse(localStorage.getItem("user"));
        setLoading(true);
        setError('');
        
        // Determine size based on screen width
        let size = 12;
        const width = window.innerWidth;
        if (width < 1024) {
            size = 9;
        }

        let available = "all";
        switch (availabilityFilter) {
            case "available":
                available = true;
                break;
            case "unavailable":
                available = false;
                break
            default:
                break;
        }

        const params = new URLSearchParams();
        if (dp !== "nodp") params.append("department", dp);
        if (selectedDepartment !== "all") params.append("department", selectedDepartment);
        if (available !== "all") params.append("available", available);
        params.append("keyword", searchQuery);
        params.append("searchBy", searchType);
        params.append("page", currentPage);
        params.append("size", size);
        params.append("sortBy", sortBy);
        params.append("direction", sortDirection);

        try {
            console.log(`${apiUrl}/api/member/books?${params.toString()}`);
            const response = await fetch(`${apiUrl}/api/member/books?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
            });
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("No books found");
                } else {
                    throw new Error("Something went wrong, please try again later.");
                }
            }

            const data = await response.json();
            console.log(data);
            setBooks(data.content);
            setTotalPages(data.totalPages);
            setTotalBooks(data.totalElements);
        } catch (err) {
            setBooks([]);
            console.error(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && e.target.value.trim() !== "") {
            if (currentPage !== 0) {
                setCurrentPage(0);
            } else {
                handleSearch();
            }
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setBooks([]);
        setAvailabilityFilter('all');
        setSelectedDepartment("all");
        setSortBy('title');
        setSortDirection('asc');
        setCurrentPage(0);
    };

    const toggleSortDirection = () => {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
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
            <div className="w-full max-w-[1440px] bg-[#101624] bg-cover bg-center" style={{ backgroundImage: 'url(/assets/images/EXPORT-BG.png)' }}>
                {/* Header - Consistent with Dashboard */}
                <header className={`flex flex-wrap items-center justify-between max-w-screen-xl mx-auto px-4 py-4 ${fadeInClass} transition-all duration-500`}>
                    <div className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-300" onClick={() => navigate('/member/Dashboard')}>
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
                        <Link to="/member/Dashboard" className="text-[#ffffff] text-lg font-medium hover:text-[#db4402] transition-colors duration-300 relative hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#db4402] after:transition-all after:duration-300 flex items-center gap-1">
                            <LocalLibrary size={18} />
                            Home
                        </Link>
                        <div className="text-[#db4402] text-lg font-medium relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#db4402] flex items-center gap-1">
                            <Book size={18} />
                            Catalog Search
                        </div>
                        <Link to="/member/Profile" className="text-[#ffffff] text-lg font-medium hover:text-[#db4402] transition-colors duration-300 relative hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#db4402] after:transition-all after:duration-300 flex items-center gap-1">
                            <School size={18} />
                            My Account
                        </Link>
                        <img src={logoutImg} alt="Logout" className="cursor-pointer hover:opacity-80 transition-opacity duration-300 hover:rotate-12 transform" onClick={logout} title="Sign Out" />
                    </nav>
                </header>

                {/* Main Content */}
                <main className={`relative max-w-screen-xl mx-auto mt-2 px-4 py-5 ${fadeInClass} transition-all duration-700 delay-200`}>
                    {/* Hero Section - Consistent with Dashboard */}
                    <div className={`text-center py-6 px-6 text-[#d5dfff] ${fadeInClass}`}>
                        <div className="relative inline-block mb-2">
                            <SearchIcon className="text-[#db4402] text-5xl animate-bounce" />
                        </div>
                        <h1 className="text-5xl font-bold mb-4 relative">
                            <span className="text-white">Library Catalog</span>
                            <br />
                            <span className="text-[#db4402] relative text-4xl">
                                Search & Discovery
                                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#db4402] animate-pulse"></span>
                            </span>
                        </h1>
                        <p className="text-xl mt-3 max-w-3xl mx-auto">
                            Find books, authors, and academic resources across our comprehensive library collection
                        </p>
                        
                        {/* Search Stats */}
                        <div className="flex justify-center gap-8 mt-8 flex-wrap">
                            <div className="bg-[#121a2e]/50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-[#db4402]">Advanced</div>
                                <div className="text-sm text-[#d5dfff]">Search Options</div>
                            </div>
                            <div className="bg-[#121a2e]/50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-[#db4402]">Real-time</div>
                                <div className="text-sm text-[#d5dfff]">Availability</div>
                            </div>
                            <div className="bg-[#121a2e]/50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-[#db4402]">Instant</div>
                                <div className="text-sm text-[#d5dfff]">Results</div>
                            </div>
                        </div>
                    </div>

                    {/* Search Section */}
                    <div id='search-sec' className={`bg-[#121a2e] rounded-lg p-8 shadow-lg mt-8 ${fadeInClass} transition-all duration-700 delay-300`}>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <SearchIcon className="mr-2 text-[#db4402]" />
                            Search Library Catalog
                        </h2>
                        
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    className="w-full px-4 py-3 pl-10 bg-[#232738] border-2 border-[#232738] rounded-lg text-[#d5dfff] focus:outline-none focus:border-[#db4402] transition-all duration-300"
                                    placeholder="Search by title, author, or ISBN..."
                                />
                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#d5dfff]" />
                                {searchQuery && (
                                    <button
                                        onClick={handleClearSearch}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#d5dfff] hover:text-[#db4402] transition-colors duration-300"
                                    >
                                        <Clear fontSize="small" />
                                    </button>
                                )}
                            </div>
                            <select
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                                className="px-4 py-3 bg-[#232738] text-[#d5dfff] rounded-lg border-2 border-[#232738] focus:outline-none focus:border-[#db4402] transition-all duration-300"
                            >
                                <option value="all">All Fields</option>
                                <option value="title">Title</option>
                                <option value="author">Author</option>
                                <option value="isbn">ISBN</option>
                            </select>
                            <button
                                onClick={handleSearch}
                                className="px-6 py-3 bg-[#db4402] text-white rounded-lg hover:bg-[#c23a02] transition-colors duration-300 flex items-center gap-2 group"
                            >
                                Search
                                <ChevronRight className="group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* Advanced Filters */}
                        <div className="flex flex-wrap items-center gap-4 p-4 bg-[#232738] rounded-lg">
                            <FilterList className="text-[#db4402]" />
                            <span className="text-[#d5dfff] font-medium">Filters:</span>
                            
                            {/* Availability Filter */}
                            <div className="flex items-center gap-2">
                                <label className="text-[#d5dfff]">Availability:</label>
                                <select
                                    className="bg-[#101624] text-[#d5dfff] px-3 py-1 border border-[#232738] rounded-md cursor-pointer hover:border-[#db4402] transition-colors duration-300"
                                    value={availabilityFilter}
                                    onChange={(e) => setAvailabilityFilter(e.target.value)}
                                >
                                    <option value="all">All Books</option>
                                    <option value="available">Available</option>
                                    <option value="unavailable">Unavailable</option>
                                </select>
                            </div>

                            {/* Department Filter */}
                            <div className="flex items-center gap-2">
                                <label className="text-[#d5dfff]">Department:</label>
                                <select
                                    className="bg-[#101624] text-[#d5dfff] px-3 py-1 border border-[#232738] rounded-md cursor-pointer hover:border-[#db4402] transition-colors duration-300"
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                >
                                    <option value="all">All Departments</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Mathematics">Mathematics</option>
                                    <option value="Chemistry">Chemistry</option>
                                    <option value="Physics">Physics</option>
                                </select>
                            </div>

                            {/* Sort By */}
                            <div className="flex items-center gap-2">
                                <label className="text-[#d5dfff]">Sort By:</label>
                                <select
                                    className="bg-[#101624] text-[#d5dfff] px-3 py-1 border border-[#232738] rounded-md cursor-pointer hover:border-[#db4402] transition-colors duration-300"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="title">Title</option>
                                    <option value="editionYear">Publication Year</option>
                                </select>
                                <button
                                    onClick={toggleSortDirection}
                                    className="text-[#d5dfff] hover:text-[#db4402] transition-colors duration-300 p-1"
                                    title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
                                >
                                    {sortDirection === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className={`bg-[#121a2e] rounded-lg shadow-lg mt-8 ${fadeInClass} transition-all duration-700 delay-400`}>
                        <div className="flex justify-between items-center p-6 border-b border-[#232738]">
                            <h2 className="text-white text-2xl font-semibold flex items-center">
                                <LibraryBooks className="mr-2 text-[#db4402]" />
                                Search Results
                                {totalBooks !== null && (
                                    <span className="ml-2 text-lg text-[#d5dfff]">({totalBooks} books found)</span>
                                )}
                            </h2>
                        </div>

                        {/* Books Grid */}
                        <div className="p-6 min-h-[400px] relative">
                            {loading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-[#121a2e]/50 backdrop-blur-sm">
                                    <div className="flex flex-col items-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#db4402] mb-4"></div>
                                        <p className="text-[#d5dfff]">Searching library catalog...</p>
                                    </div>
                                </div>
                            )}

                            {!loading && books.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-[300px]">
                                    <MenuBook style={{ fontSize: 64 }} className="text-[#232738] mb-4 animate-pulse" />
                                    <h3 className="text-xl font-semibold text-white mb-2">
                                        {searchQuery ? "No books found" : "Start your search"}
                                    </h3>
                                    <p className="text-[#d5dfff] text-center text-lg">
                                        {searchQuery ?
                                            "No books found matching your search criteria. Try different keywords or check your spelling." :
                                            "Enter a search term above to find books in our library catalog."}
                                    </p>
                                </div>
                            )}

                            {!loading && books.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                                    {books.map((book, index) => (
                                        <div
                                            key={book.id}
                                            className="transform transition-all duration-500 opacity-0 animate-fadeIn hover:scale-105"
                                            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                                        >
                                            <BookCard book={book} handleCardClick={handleCardClick} openBorrowModal={() => { setIsBorrowModalOpen(true); setBorrowModalBook(book) }} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {books.length > 0 && (
                            <div className="px-6 pb-6">
                                <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                            </div>
                        )}
                    </div>
                </main>

                {/* Book Details Modal */}
                <BookDetailsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    book={selectedBook}
                    borrowing={null}
                />
                <BorrowModal isOpen={isBorrowModalOpen} book={borrowModalBook} onClose={() => setIsBorrowModalOpen(false)} />
            </div>
        </div>
    );
}

// CSS for animations
if (!document.getElementById('search-animations')) {
    const style = document.createElement('style');
    style.id = 'search-animations';
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
        }
    `;
    document.head.appendChild(style);
}