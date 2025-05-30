import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import book from '../assets/book.png';
import plusBook from '../assets/Plusbook.png';
import Pagination from '../components/Pagination';
import toast from 'react-hot-toast';
import { ChevronDown, ChevronUp, Filter, Search, X } from 'lucide-react';
import AdminSideBar from '../components/AdminSideBar';
import CoverImage from '../components/CoverImage';

const apiUrl = import.meta.env.VITE_API_URL;

export default function AllBooks() {
  const location = useLocation();

  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    publisher: "",
    editionYear: "",
    isbn: "",
    cote: "",
    numberOfCopies: "",
    coverUrl: "",
    department: "Computer Science",
    description: "",
  });
  const [mode, setMode] = useState("list");
  const [user, setUser] = useState({});
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [sortOrder, setSortOrder] = useState("title");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [detailModal, setDetailModal] = useState(null);
  const [errors, setErrors] = useState({
    cote: "",
    isbn: "",
  });
  const [shouldSearch, setShouldSearch] = useState(false);


  // Set mode if navigated with "add" state
  useEffect(() => {
    if (location.state?.mode === "add") {
      setMode("add");
    }
  }, [location.state]);

  // Trigger search if query is empty
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setShouldSearch(true);
    }
  }, [searchQuery]);

  // Reset page to 0 on department or sort change, then trigger search
  useEffect(() => {
    if (currentPage !== 0) {
      setCurrentPage(0); // Triggers another effect
    } else {
      setShouldSearch(true);
    }
  }, [selectedDepartment, sortOrder]);

  // Trigger search when currentPage changes (e.g. pagination)
  useEffect(() => {
    setShouldSearch(true);
  }, [currentPage]);

  // Centralized fetchBooks call
  useEffect(() => {
    if (shouldSearch) {
      fetchBooks();
      setShouldSearch(false);
    }
  }, [shouldSearch]);

  // Manual search on Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== "") {
      if (currentPage !== 0) {
        setCurrentPage(0); // Will trigger search via currentPage effect
      } else {
        setShouldSearch(true); // Trigger search directly
      }
    }
  };
  const validateForm = () => {
    let valid = true;

    // Validate required fields
    if (!bookData.title || !bookData.author || !bookData.publisher || !bookData.editionYear || !bookData.isbn || !bookData.cote || !bookData.numberOfCopies || !bookData.department) {
      toast.error("Please fill in all required fields.");
      valid = false;
    }
    return valid;
  };
  const handleSaveBook = () => {
    const isValid = validateForm();
    if (!isValid) return;
    saveBook();
  }

  const openDetailModal = (book) => setDetailModal(book);
  const closeDetailModal = () => setDetailModal(null);

  const handleOpenDeleteModal = (book) => {
    setSelectedBook(book);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedBook) {
      await deleteBook(selectedBook.id);
      setShowDeleteModal(false);
      setSelectedBook(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedBook(null);
  };

  const fetchBooks = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    let sortBy;
    let direction;
    switch (sortOrder) {
      case "title-desc":
        sortBy = "title";
        direction = "desc";
        break;
      case "author":
        sortBy = "author";
        direction = "asc";
        break;
      case "author-desc":
        sortBy = "author";
        direction = "desc";
        break;
      case "newest":
        sortBy = "addedDate";
        direction = "desc";
        break;
      case "oldest":
        sortBy = "addedDate";
        direction = "asc";
        break;
      default:
        sortBy = "title";
        direction = "asc";
        break;
    }
    const params = new URLSearchParams();
    if (selectedDepartment !== "all") params.append("department", selectedDepartment);
    if (searchQuery) params.append("keyword", searchQuery);
    params.append("page", currentPage);
    params.append("sortBy", sortBy);
    params.append("direction", direction);

    try {
      setIsLoading(true);
      console.log(`${apiUrl}/api/staff/books?${params.toString()}`);
      const response = await fetch(`${apiUrl}/api/staff/books?${params.toString()}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${user?.token || ''}`
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch books`);
      }
      const data = await response.json();
      console.log(data);
      setBooks(data.content);
      setTotalPages(data.totalPages);
      setTotalBooks(data.totalElements);
    } catch (error) {
      console.log(`Error fetching books:`, error);
      toast.error("Failed to load books");
    } finally {
      setIsLoading(false);
    }
  }


  const addCopies = async (bookId, numberOfNewCopies) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const params = new URLSearchParams();
    params.append("numberOfCopies", numberOfNewCopies);
    try {
      const response = await fetch(`${apiUrl}/api/staff/bookCopy/${bookId}?${params.toString()}`, {
        method: "POST",
        headers: {
          'Content-type': 'application/json',
          "Authorization": `Bearer ${user?.token || ''}`
        },
      });

      if (!response.ok) {
        throw new Error("Failed to add copies");
      }

      const data = await response.json();
      toast.success(`Successfully added ${numberOfNewCopies} new copies`);
      fetchBooks();
      closeDetailModal();
    } catch (error) {
      toast.error("Error adding new copies");
      console.error(error);
    }
  };

  const deleteBook = async (bookId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await fetch(`${apiUrl}/api/staff/book/${bookId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${user?.token || ''}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to delete the book");
      }

      const data = await response.json();
      console.log(data);
      toast.success("Book deleted successfully");
      fetchBooks();
    } catch (error) {
      toast.error("Error deleting the book");
      console.log(`Error deleting the book:`, error);
    }
  };
  const removeBookCopy = async (inventoryNumber) => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await fetch(`${apiUrl}/api/staff/bookCopy/${inventoryNumber}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${user?.token || ''}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.error) {
          toast.error(data.error);
          return;
        } else {
          throw new Error("Failed to delete the bookCopy");
        }
      }

      const data = await response.json();
      console.log(data);
      toast.success("BookCopy deleted successfully");
      fetchBooks();
    } catch (error) {
      toast.error("Error deleting the bookCopy");
      console.log(`Error deleting the bookCopy:`, error);
    }
  };


  const saveBook = async () => {
    const hasError = Object.values(errors).some(errorMsg => errorMsg);
    if (hasError) {
      toast.error("Please fix the validation errors before submitting.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const response = await fetch(`${apiUrl}/api/staff/book`, {
        method: "POST",
        headers: {
          'Content-type': 'application/json',
          "Authorization": `Bearer ${user?.token || ''}`
        },
        body: JSON.stringify({
          title: bookData.title,
          author: bookData.author,
          publisher: bookData.publisher,
          editionYear: bookData.editionYear,
          isbn: bookData.isbn,
          cote: bookData.cote,
          numberOfCopies: bookData.numberOfCopies,
          department: bookData.department,
          description: bookData.description,
          coverUrl: bookData.coverUrl
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to add the book`);
      }

      const data = await response.json();
      console.log(data);
      toast.success("Book added successfully");
      setMode("list");
      fetchBooks();
    } catch (error) {
      toast.error("Error adding the book");
      console.log(`Error adding the book:`, error);
    }
  };

  const validateCote = async () => {
    if (bookData.cote === "") {
      setErrors(prev => ({ ...prev, cote: "" }));
      return;
    }
    const coteRegex = /^\d{3}-\d{1,3}$/;

    if (!coteRegex.test(bookData.cote)) {
      setErrors(prev => ({ ...prev, cote: "Cote must be in format XXX-YYY (e.g., 004-153)" }));
      return;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await fetch(`${apiUrl}/api/staff/validate/cote?cote=${encodeURIComponent(bookData.cote)}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${user?.token || ''}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (data === true) {
          setErrors(prev => ({ ...prev, cote: "" }));
        } else {
          setErrors(prev => ({ ...prev, cote: "Invalid Cote" }));
        }
      } else {
        setErrors(prev => ({ ...prev, cote: "Something went wrong." }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const validateIsbn = async () => {
    const isbn = bookData.isbn.trim();
    if (isbn === "") {
      setErrors(prev => ({ ...prev, isbn: "" }));
      return;
    }

    const isValidIsbn10 = /^\d{9}[\dX]$/.test(isbn);
    const isValidIsbn13 = /^\d{13}$/.test(isbn);

    if (!isValidIsbn10 && !isValidIsbn13) {
      setErrors(prev => ({ ...prev, isbn: "Invalid ISBN format (must be ISBN-10 or ISBN-13)." }));
      return;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await fetch(`${apiUrl}/api/staff/validate/isbn?isbn=${encodeURIComponent(isbn)}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${user?.token || ''}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (data === true) {
          setErrors(prev => ({ ...prev, isbn: "" }));
        } else {
          setErrors(prev => ({ ...prev, isbn: "Invalid ISBN." }));
        }
      } else {
        setErrors(prev => ({ ...prev, isbn: "Something went wrong." }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Format a date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-[#f8f8ff] rounded-2xl relative min-h-screen overflow-y-auto">
      <AdminSideBar />

      {/* Main Content */}
      <div className="ml-[288px] px-10 py-5">
        <div className="flex flex-row items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#1e293b] mb-1">Books Management</h1>
            <p className="text-[#64748b] text-sm">View and manage your library's book collection</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative w-[300px]">
              <input
                type="search"
                placeholder="Search by title, author, or ISBN"
                className="w-full pl-10 pr-4 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:border-[#25388c] focus:ring-1 focus:ring-[#25388c] focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            {/* Filter Button */}
            <button
              className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="h-4 w-4" />
              Filter
              {isFilterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Filter Section */}
        {isFilterOpen && (
          <div className="mt-4 mb-6 p-4 bg-white rounded-lg shadow-sm border border-[#e2e8f0]">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-1">Department</label>
                <select
                  className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm w-[200px]"
                  value={selectedDepartment}
                  onChange={(e) => { setCurrentPage(0); setSelectedDepartment(e.target.value); }}
                >
                  <option value="all">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-1">Sort By</label>
                <select
                  className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm w-[150px]"
                  value={sortOrder}
                  onChange={(e) => { setCurrentPage(0); setSortOrder(e.target.value); }}
                >
                  <option value="title">Sort by Title</option>
                  <option value="author">Sort by Author</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
              <div className="flex items-end gap-3">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedDepartment('all');
                    setSortOrder('title');
                    setCurrentPage(0);
                    setTimeout(() => fetchBooks(), 0);
                  }}
                  className="px-4 py-2 border border-[#e2e8f0] rounded-lg text-sm hover:bg-gray-100"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="bg-white rounded-2xl p-6 shadow-md my-5">
          {mode === "list" ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold">Books List</h2>
                  <span className="text-[#64748b] text-sm">
                    {isLoading ? "Loading..." : `${totalBooks} ${totalBooks === 1 ? 'book' : 'books'}`}
                  </span>
                </div>
                <button
                  onClick={() => setMode("add")}
                  className="px-4 py-2 bg-[#25388c] text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-[#1e2a6d] transition"
                >
                  <img src={plusBook} alt="Add" className="w-4 h-4 filter brightness-0 invert" />
                  Add New Book
                </button>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#25388c]"></div>
                </div>
              )}

              {/* Table */}
              {!isLoading && (
                <div className="w-full overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSortOrder((prev) => {
                                console.log("switching");
                                switch (prev) {
                                  case "title":
                                    return "title-desc";
                                  case "title-desc":
                                    return "title"
                                  case "author":
                                    return "author-desc";
                                  case "author-desc":
                                    return "author";
                                  default:
                                    return "title";
                                }
                              })
                            }}
                            className="flex items-center gap-1 hover:text-[#25388c]"
                          >
                            Book Info
                            {(sortOrder === "title" || sortOrder === 'author') && <ChevronUp className="h-4 w-4" />}
                            {(sortOrder === 'title-desc' || sortOrder === 'author-desc') && <ChevronDown className="h-4 w-4" />}
                          </button>
                        </th>
                        <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">Department</th>
                        <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">ISBN / Cote</th>
                        <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">
                          <button
                            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                            className="flex items-center gap-1 hover:text-[#25388c]"
                          >
                            Date Added
                            {sortOrder === 'newest' && <ChevronDown className="h-4 w-4" />}
                            {sortOrder === 'oldest' && <ChevronUp className="h-4 w-4" />}
                          </button>
                        </th>
                        <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">Status</th>
                        <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.length > 0 ? (
                        books.map((book) => (
                          <tr key={book.id} className="border-b border-[#e2e8f0] hover:bg-gray-50 cursor-pointer" onClick={() => openDetailModal(book)}>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                                  <CoverImage coverUrl={book?.coverUrl} title={book.title} />
                                </div>
                                <div>
                                  <p className="font-medium text-[#1e293b]">{book.title}</p>
                                  <p className="text-[#64748b] text-sm">by {book.author}</p>
                                  <p className="text-[#64748b] text-xs">{book.publisher}, {book.editionYear}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-[#475569]">{book.department}</td>
                            <td className="px-4 py-4">
                              <p className="text-sm text-[#475569]">ISBN: {book.isbn}</p>
                              <p className="text-sm text-[#475569]">Cote: {book.cote}</p>
                            </td>
                            <td className="px-4 py-4 text-sm text-[#475569]">{formatDate(book.addedDate)}</td>
                            <td className="px-4 py-4">
                              {book.availableCopies > 0 ? (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                  {book.availableCopies}/{book.numberOfCopies} Available
                                </span>
                              ) : (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                  Unavailable
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDetailModal(book);
                                  }}
                                  className="px-3 py-1.5 bg-[#25388c] text-white rounded-lg text-xs font-medium hover:bg-[#1e2a6d] transition"
                                >
                                  View
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenDeleteModal(book);
                                  }}
                                  className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-medium hover:bg-red-200 transition"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-4 py-8 text-center text-[#64748b]">
                            {searchQuery || selectedDepartment !== 'all'
                              ? "No matching books found"
                              : "No books available in the library"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              {!isLoading && totalPages > 1 && <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />}
            </>
          ) : (
            <>
              {/* Add Book Form */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Add New Book</h2>
                <button
                  onClick={() => setMode("list")}
                  className="px-4 py-2 border border-[#25388c] text-[#25388c] rounded-lg text-sm font-medium hover:bg-[#f1f5ff] transition"
                >
                  Go Back
                </button>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => {
                e.preventDefault();
                handleSaveBook();
              }}>
                <div className="flex flex-col items-start gap-2 w-full">
                  <label htmlFor="title" className="text-sm font-medium text-[#475569]">Title <span className="text-red-500">*</span></label>
                  <input required
                    className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:border-[#25388c] focus:outline-none"
                    id="title"
                    type="text"
                    placeholder="Book Title"
                    value={bookData.title}
                    onChange={(e) => setBookData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="flex flex-col items-start gap-2 w-full">
                  <label htmlFor="author" className="text-sm font-medium text-[#475569]">Author <span className="text-red-500">*</span></label>
                  <input required
                    className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:border-[#25388c] focus:outline-none"
                    id="author"
                    type="text"
                    placeholder="Author Name"
                    value={bookData.author}
                    onChange={(e) => setBookData(prev => ({ ...prev, author: e.target.value }))}
                  />
                </div>

                <div className="flex flex-col items-start gap-2 w-full">
                  <label htmlFor="publisher" className="text-sm font-medium text-[#475569]">Publisher <span className="text-red-500">*</span></label>
                  <input required
                    className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:border-[#25388c] focus:outline-none"
                    id="publisher"
                    type="text"
                    placeholder="Publisher Name"
                    value={bookData.publisher}
                    onChange={(e) => setBookData(prev => ({ ...prev, publisher: e.target.value }))}
                  />
                </div>

                <div className="flex flex-col items-start gap-2 w-full">
                  <label htmlFor="editionYear" className="text-sm font-medium text-[#475569]">Edition Year <span className="text-red-500">*</span></label>
                  <input required
                    className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:border-[#25388c] focus:outline-none"
                    id="editionYear"
                    type="number"
                    max={new Date().getFullYear()}
                    min={0}
                    placeholder="Publication Year"
                    value={bookData.editionYear}
                    onChange={(e) => setBookData(prev => ({ ...prev, editionYear: e.target.value }))}
                  />
                </div>

                {/* ISBN */}
                <div className="flex flex-col items-start gap-2 w-full">
                  <label htmlFor="isbn" className="text-sm font-medium text-[#475569]">ISBN <span className="text-red-500">*</span></label>
                  <input
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:border-[#25388c] focus:outline-none"
                    id="isbn"
                    type="text"
                    placeholder="ISBN Number"
                    value={bookData.isbn}
                    onChange={(e) => setBookData((p) => ({ ...p, isbn: e.target.value }))}
                    onBlur={validateIsbn}
                  />
                  {errors.isbn && <p className="text-xs text-red-600">{errors.isbn}</p>}
                </div>

                {/* Cote */}
                <div className="flex flex-col items-start gap-2 w-full">
                  <label htmlFor="cote" className="text-sm font-medium text-[#475569]">Cote <span className="text-red-500">*</span></label>
                  <input
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:border-[#25388c] focus:outline-none"
                    id="cote"
                    type="text"
                    placeholder="Library cote"
                    value={bookData.cote}
                    onChange={(e) => setBookData((p) => ({ ...p, cote: e.target.value }))}
                    onBlur={validateCote}
                  />
                  {errors.cote && <p className="text-xs text-red-600">{errors.cote}</p>}
                </div>

                {/* Number of copies */}
                <div className="flex flex-col items-start gap-2 w-full">
                  <label htmlFor="copies" className="text-sm font-medium text-[#475569]">Number of Copies <span className="text-red-500">*</span></label>
                  <input
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:border-[#25388c] focus:outline-none"
                    id="copies"
                    type="number"
                    min={1}
                    placeholder="e.g. 3"
                    value={bookData.numberOfCopies}
                    onChange={(e) => setBookData((p) => ({ ...p, numberOfCopies: e.target.value }))}
                  />
                </div>

                {/* Department */}
                <div className="flex flex-col items-start gap-2 w-full">
                  <label className="text-sm font-medium text-[#475569]">Department <span className="text-red-500">*</span></label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg focus:border-[#25388c] focus:outline-none"
                    value={bookData.department}
                    onChange={(e) => setBookData((p) => ({ ...p, department: e.target.value }))}
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label htmlFor="description" className="text-sm font-medium text-[#475569]">Description </label>
                  <textarea
                    id="description"
                    rows="4"
                    className="w-full px-4 py-2 border rounded-lg focus:border-[#25388c] focus:outline-none"
                    placeholder="Short summary of the book"
                    value={bookData.description}
                    onChange={(e) => setBookData((p) => ({ ...p, description: e.target.value }))}
                  />
                </div>

                {/* Cover Image  */}
                <div className="md:col-span-2 border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-[#475569] mb-4">Cover Image</h3>

                  <div className="flex gap-6">
                    {/*  URL Input */}
                    <div className="flex-1">
                      <p className="text-sm text-[#475569] mb-2">Enter image URL</p>
                      <input
                        type="url"
                        className="w-full px-4 py-2 border rounded-lg focus:border-[#25388c] focus:outline-none"
                        placeholder="Enter book cover image URL"
                        value={bookData.coverUrl}
                        onChange={(e) => setBookData(prev => ({ ...prev, coverUrl: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="mt-4">
                    <p className="text-sm text-[#475569] mb-2">Preview</p>
                    {bookData.coverUrl && (
                      <div className="relative w-32 min-h-4">
                        <div >
                          <CoverImage coverUrl={bookData?.coverUrl} size={86} />
                        </div>
                        <button
                          onClick={() => {
                            setBookData(prev => ({ ...prev, coverUrl: "" }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#25388c] text-white rounded-lg text-sm font-medium hover:bg-[#1e2a6d]"
                  >
                    Save Book
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {detailModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative">
            <button className="absolute right-4 top-4" onClick={closeDetailModal}>
              <X className="w-5 h-5" />
            </button>
            <div className="flex gap-6 justify-center items-center ">
              <div className='w-[232px] h-[288px]'>
                <CoverImage coverUrl={detailModal?.coverUrl} title={detailModal.title} size={160} />
              </div>
              <div className="flex flex-col gap-1 text-sm">
                <h3 className="text-xl font-semibold mb-1 px-2">{detailModal.title}</h3>
                <p>Author: {detailModal.author}</p>
                <p>Publisher: {detailModal.publisher}</p>
                <p>Edition Year: {detailModal.editionYear}</p>
                <p>ISBN: {detailModal.isbn}</p>
                <p>Cote: {detailModal.cote}</p>
                <p>Department: {detailModal.department}</p>
                <p className="mt-2 text-[#475569]">{detailModal.description || 'No description.'}</p>

                {/* Copies Info */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Copies Management</p>
                    <p className="text-sm text-gray-600 ml-4">
                      Total Copies: {detailModal.numberOfCopies}
                      (Available: {detailModal.availableCopies})
                    </p>
                  </div>

                  {/* Add Copies */}
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="Add copies"
                      className="px-3 py-1.5 border rounded-lg text-sm w-32"
                      id="addCopiesCount"
                    />
                    <button
                      onClick={() => {
                        const count = parseInt(document.getElementById('addCopiesCount').value);
                        if (count && count > 0) {
                          addCopies(detailModal.id, count);
                        } else {
                          toast.error("Please enter a valid number of copies to add");
                        }
                      }}
                      className="px-4 py-1.5 bg-[#25388c] text-white rounded-lg text-sm hover:bg-[#1e2a6d]"
                    >
                      Add Copies
                    </button>
                  </div>

                  {/* Remove Copies */}
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="text"
                      min="1"
                      placeholder="Copy number e.g 3"
                      className="px-3 py-1.5 border rounded-lg text-sm w-32"
                      id="removeCopyNumber"
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById('removeCopyNumber');
                        const value = parseInt(input.value.trim());

                        if (!value) {
                          toast.error("Please enter Copy number");
                        } else if (value > detailModal.numberOfCopies || value <= 0) {
                          toast.error("Invalid Copy number. must be less number the number of the copies and greater then 0");
                        } else {
                          removeBookCopy(`${detailModal.cote}.${value}`);
                        }
                      }}
                      className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                    >
                      Remove Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Delete Confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center space-y-4">
            <h3 className="text-lg font-semibold">Delete Book</h3>
            <p>Are you sure you want to delete <span className="font-medium">{selectedBook?.title}</span>? This action cannot be undone.</p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
