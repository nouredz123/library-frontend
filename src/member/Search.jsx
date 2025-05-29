import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Book, MenuBook, FilterList, Clear, ChevronRight, ArrowUpward, ArrowDownward } from '@mui/icons-material';
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
    const [sortDirection, setSortDirection] = useState('asc'); // 'asc', 'desc'

    const navigate = useNavigate();

    // Animation effect after component mounts
    useEffect(() => {
        setIsPageLoaded(true);
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            handleSearch();
        }
    }, [searchQuery]);

    useEffect(() => {
        if (currentPage !== 0) {
            setCurrentPage(0);
        } else {
            handleSearch();
        }
    }, [availabilityFilter, sortBy, sortDirection]);

    useEffect(() => {
        handleSearch();
    }, [currentPage]);

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
        setSortBy('title');
        setSortDirection('asc');
        setCurrentPage(0);
    };

    const handleSearch = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        setLoading(true);
        setError('');
        // Determine size based on screen width
        let size = 8;
        const width = window.innerWidth;

        if (width < 1024) {
            size = 6;
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
        params.append("keyword", searchQuery);
        params.append("searchBy", searchType);
        if (available !== "all") params.append("available", available);

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

    //  CSS classes for animations
    const fadeInClass = isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10";

    return (
        <div className="flex justify-center w-full bg-[#101624] min-h-screen">
            <div className="w-full max-w-[1440px] bg-[#101624] bg-cover bg-center pb-24" style={{ backgroundImage: 'url(/assets/images/EXPORT-BG.png)' }}>
                {/* Header  */}
                <header className={`flex flex-col md:flex-row items-center justify-between max-w-screen-xl w-full px-4 mx-auto py-4 ${fadeInClass} transition-all duration-500`}>
                    <div className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-300" onClick={() => navigate('/member/Dashboard')}>
                        <div className="w-[60px] h-[56px] animate-pulse">
                            <img src={logo} alt="Logo" className="w-12 h-12 object-cover" />
                        </div>
                        <p className="text-2xl font-semibold">
                            <span className="text-white">Book</span>
                            <span className="text-[#db4402]">FSEI</span>
                        </p>
                    </div>
                    <nav className="flex items-center gap-8">
                        <Link to="/member/Dashboard" className="text-[#d5dfff] text-lg font-medium hover:text-[#db4402] transition-colors duration-300 relative hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#db4402] after:transition-all after:duration-300">Home</Link>
                        <div className="text-[#db4402] text-lg font-medium relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#db4402]">Search</div>
                        <Link to="/member/Profile" className="text-[#d5dfff] text-lg font-medium hover:text-[#db4402] transition-colors duration-300 relative hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#db4402] after:transition-all after:duration-300">Profile</Link>
                        <img src={logoutImg} alt="Logout" className="cursor-pointer hover:opacity-80 transition-opacity duration-300 hover:rotate-12 transform" onClick={logout} />
                    </nav>
                </header>

                {/* Search Section with animations */}
                <div className={`flex flex-col items-center mt-8 ${fadeInClass} transition-all duration-700 delay-200`}>
                    <div className="text-center relative">
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                            <MenuBook className="text-[#db4402] text-5xl animate-pulse" />
                        </div>
                        <p className="text-[#d5dfff] text-lg font-semibold tracking-[1.8px] mb-2">
                            DISCOVER YOUR NEXT GREAT READ:
                        </p>
                        <p className="text-white text-3xl md:text-4xl lg:text-5xl font-semibold leading-snug md:leading-[64px] max-w-[90%] md:max-w-[650px] mx-auto">
                            <span>Explore and Search for </span>
                            <span className="text-[#db4402] relative">
                                Any Book
                                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#db4402] animate-pulse"></span>
                            </span>
                            <span> In Our Library</span>
                        </p>
                    </div>

                    <div className={`flex flex-col justify-center md:flex-row gap-3 mt-6 ${fadeInClass} transition-all duration-700 delay-300 w-full max-w-screen-md mx-auto`}>
                        <div className="relative w-full md:min-w-[400px]">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                }}
                                onKeyDown={handleKeyPress}
                                className="w-full px-4 py-3 pl-10 bg-[#232738] border-4 border-[#232738] rounded-lg text-[#d5dfff] focus:outline-none focus:border-[#db4402] transition-all duration-300"
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
                            className="px-3 py-3 bg-[#232738] text-[#d5dfff] rounded-lg border-4 border-[#232738] focus:outline-none focus:border-[#db4402] transition-all duration-300"
                        >
                            <option value="all">All Fields</option>
                            <option value="title">Title</option>
                            <option value="author">Author</option>
                            <option value="isbn">ISBN</option>
                        </select>
                        <button
                            onClick={handleSearch}
                            className="px-3 py-0.5 bg-[#db4402] text-[#d5dfff] rounded-lg hover:bg-[#e45617] transition-colors duration-300 flex items-center gap-2 group justify-center"
                        >
                            Search
                            <ChevronRight className="group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                    </div>

                    <div className={`w-full max-w-screen-xl px-4 mx-auto mt-12 ${fadeInClass} transition-all duration-700 delay-400`}>
                        <div className="flex justify-between items-center bg-[#121a2e] p-4 rounded-t-lg border-b border-[#232738]">
                            <h2 className="text-white text-2xl font-semibold flex items-center">
                                <Book className="mr-2 text-[#db4402]" />
                                Search Results
                            </h2>
                            <div className="flex flex-col lg:flex-row items-center gap-3 bg-[#232738] px-4 py-2 rounded-lg">
                                <FilterList className="text-[#db4402]" />

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
                                        className="text-[#d5dfff] hover:text-[#db4402] transition-colors duration-300"
                                        title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
                                    >
                                        {sortDirection === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Books Grid with animations */}
                        <div className="bg-[#121a2e] p-6 rounded-b-lg min-h-[300px] relative">
                            {loading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-[#121a2e]/50 backdrop-blur-sm">
                                    <div className="flex flex-col items-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#db4402] mb-4"></div>
                                        <p className="text-[#d5dfff]">Searching the library...</p>
                                    </div>
                                </div>
                            )}

                            {!loading && books.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-[300px]">
                                    <MenuBook style={{ fontSize: 64 }} className="text-[#232738] mb-4" />
                                    <p className="text-[#a5b1c2] text-center text-lg">
                                        {searchQuery ?
                                            "No books found matching your search criteria. Try a different search term!" :
                                            "Enter a search term to find books in our library."}
                                    </p>
                                </div>
                            )}

                            {!loading && books.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {books.map((book, index) => (
                                        <div
                                            key={book.id}
                                            className="transform transition-all duration-500 opacity-0 animate-fadeIn"
                                            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                                        >
                                            <BookCard book={book} handleCardClick={handleCardClick} openBorrowModal={() => { setIsBorrowModalOpen(true); setBorrowModalBook(book) }} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {
                            books.length > 0 && <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                        }
                    </div>
                </div>
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