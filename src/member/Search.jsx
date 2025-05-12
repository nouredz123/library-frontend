import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import logoutImg from '../assets/logout.png';
import logo from '../assets/logo.png';
import toast from 'react-hot-toast';
import BookCard from '../components/BookCard';

export default function Search() {
    const [searchQuery, setSearchQuery] = useState('');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        const user = JSON.parse(localStorage.getItem("user"));
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`http://localhost:8080/api/member/books/search?keyword=${encodeURIComponent(searchQuery)}&page=0&size=10&sortBy=title&direction=asc`, {
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
        } catch (err) {
            setBooks([]);
            console.error(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        navigate("/sign-in", { replace: true });
        console.log('Logging out...');
        window.history.pushState(null, "", window.location.href);
        window.onpopstate = function () {
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
                        <Link to="/member/Dashboard" className="text-[#d5dfff] text-lg font-medium hover:text-[#db4402] transition">Home</Link>
                        <div className="text-[#db4402] text-lg font-medium">Search</div>
                        <Link to="/member/Profile" className="text-[#d5dfff] text-lg font-medium hover:text-[#db4402] transition">Profile</Link>
                        <img src={logoutImg} alt="Logout" className="cursor-pointer hover:opacity-80 transition" onClick={logout} />
                    </nav>
                </header>
                {/* Search Section */}
                <div className="flex flex-col items-center mt-12">
                    <div className="text-center">
                        <p className="text-[#d5dfff] text-lg font-semibold tracking-[1.8px] mb-4">
                            DISCOVER YOUR NEXT GREAT READ:
                        </p>
                        <p className="text-white text-5xl font-semibold leading-[64px] w-[650px]">
                            <span>Explore and Search for </span>
                            <span className="text-[#db4402]">Any Book </span>
                            <span>In Our Library</span>
                        </p>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-[400px] px-4 py-3 bg-[#232738] border-4 border-[#232738] rounded-lg text-[#d5dfff] focus:outline-none"
                            placeholder="Search by title, author, or ISBN..."
                        />
                        <button
                            onClick={handleSearch}
                            className="px-6 py-3 bg-[#db4402] text-[#d5dfff] rounded-lg hover:bg-[#e45617] transition"
                        >
                            Search
                        </button>
                    </div>

                    <div className="w-[1240px] mx-auto mt-16">
                        <div className="flex justify-between items-center">
                            <h2 className="text-white text-2xl font-semibold">Search Results</h2>
                            <div className="flex items-center gap-3 bg-[#232738] px-4 py-3 rounded-lg">
                                <label className="text-[#d5dfff]">Filter by:</label>
                                <select className="bg-[#101624] text-[#db4402] px-2 py-1 border border-[#d5dfff] rounded cursor-pointer">
                                    <option value="department">Department</option>
                                    <option value="title">Title</option>
                                    <option value="author">Author</option>
                                </select>
                            </div>
                        </div>

                        {/* Books Grid */}
                        <div className="grid grid-cols-5 gap-4 mt-8 relative min-h-[200px]">
                            {loading && (
                                <p className="text-white absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    Loading...
                                </p>
                            )}

                            {!loading && books.length === 0 && (
                                <p className="text-[#a5b1c2] text-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    No books found. Try searching something else!
                                </p>
                            )}

                            {books.map((book) => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Book Details Modal - Add your modal implementation here */}
            </div>
        </div>
    );
}
