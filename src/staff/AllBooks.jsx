import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.png';
import home from '../assets/home.png';
import profile from '../assets/profile-2user.png';
import book from '../assets/book.png';
import borrow from '../assets/bookmark-2.png';
import userIcon from '../assets/user.png';
import logoutImg from '../assets/logout.png';
import plusBook from '../assets/Plusbook.png';
import bookNotAvailable from '../assets/book-notAvailable.jpg'
import { Link, useNavigate } from 'react-router-dom';
import BookItem from '../components/BookItem';
import Pagination from '../components/Pagination';
import toast from 'react-hot-toast';

const apiUrl = import.meta.env.VITE_API_URL;
export default function AllBooks() {
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
  });
  const [mode, setMode] = useState("list");
  const [user, setUser] = useState({});
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [sortOrder, setSortOrder] = useState("title");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [errors, setErrors] = useState({
    cote: "",
    isbn: "",
  });

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Implement the filtering logic here based on searchQuery
  };

  const deleteBook = (bookId) => {
    // Handle deleting a book by its ID
    console.log("Deleting book with ID:", bookId);
  };
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
    fetchBooks(selectedDepartment, sortOrder);
  }, [selectedDepartment, sortOrder, currentPage]);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/sign-in", { replace: true });
    console.log('Logging out...');
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  };

  const fetchBooks = async (department = "all", sort) => {
    const user = JSON.parse(localStorage.getItem("user"));
    let sortBy;
    let direction;

    switch (sort) {
      case "author":
        sortBy = "author";
        direction = "asc";
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
    if (department !== "all") params.append("department", department);
    params.append("page", currentPage);
    params.append("sortBy", sortBy);
    params.append("direction", direction);
    try {
      const response = await fetch(`http://localhost:8080/api/staff/books?${params.toString()}`, {
        method: "GET",
        headers: {
          'Content-type': 'application/json',
          "Authorization": `Bearer ${user?.token || ''}`
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch  books`);
      }

      const data = await response.json();
      console.log(data);
      setBooks(data._embedded.bookList);
      setTotalPages(data.page.totalPages);
      setTotalBooks(data.page.totalElements);

    } catch (error) {
      console.log(`Error fetching users:`, error);

    }
  }

  const saveBook = async () => {
    const hasError = Object.values(errors).some(errorMsg => errorMsg);
    if (hasError) {
      toast.error("Please fix the validation errors before submitting.");
      return
    }
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await fetch(`http://localhost:8080/api/staff/book`, {
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
          coverUrl: "",
          department: bookData.department,
        })
      });
      if (!response.ok) {
        throw new Error(`Failed to add the book`);
      }

      const data = await response.json();
      console.log(data);
      toast.success("book added successfully");

    } catch (error) {
      toast.error("Error adding the book");
      console.log(`Error adding the book:`, error);

    }

  }

  const validateCote = async () => {
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
          setErrors(prev => ({ ...prev, cote: "Cote already exists." }));
        }
      } else {
        setErrors(prev => ({ ...prev, cote: "Something went wrong." }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const validateIsbn = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const response = await fetch(`${apiUrl}/api/staff/validate/isbn?isbn=${encodeURIComponent(bookData.isbn)}`, {
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
          setErrors(prev => ({ ...prev, isbn: "ISBN already exists." }));
        }
      } else {
        setErrors(prev => ({ ...prev, isbn: "Something went wrong." }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-[#f8f8ff] rounded-2xl relative min-h-screen overflow-y-auto">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-[288px] bg-white border-r border-[#edf1f1] flex flex-col justify-between p-4">
        {/* Top Section */}
        <div>
          <div className="py-5 flex flex-row gap-1.5 items-center">
            <img src={logo} alt="BookFSEI Logo" className="w-10 h-10" />
            <div className="text-[#25388c] font-semibold text-[26px] leading-6">
              BookFSEI
            </div>
          </div>
          <div className="border-t border-dashed border-[#8c8e98] my-4"></div>

          {/* Menu */}
          <div className="flex flex-col gap-2">
            <Link to="/staff/Dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#f8fafc] cursor-pointer">
              <img src={home} alt="Home Icon" className="w-5 h-5" />
              <p className="text-[#475569] text-sm font-medium">Home</p>
            </Link>
            <Link to="/staff/AllUsers" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#f8fafc] cursor-pointer">
              <img src={profile} alt="Users Icon" className="w-5 h-5" />
              <p className="text-[#475569] text-sm font-medium">All Users</p>
            </Link>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#25388c] cursor-pointer">
              <img src={book} alt="Books Icon" className="w-5 h-5 filter brightness-0 invert" />
              <p className="text-white text-sm font-medium">All Books</p>
            </div>
            <Link to="/staff/borrowrequests" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#f8fafc] cursor-pointer">
              <img src={borrow} alt="Borrow Icon" className="w-5 h-5" />
              <p className="text-[#475569] text-sm font-medium">Borrow Requests</p>
            </Link>
            <Link to="/staff/accountrequests" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#f8fafc] cursor-pointer">
              <img src={userIcon} alt="Account Icon" className="w-5 h-5" />
              <p className="text-[#475569] text-sm font-medium">Account Requests</p>
            </Link>
          </div>
        </div>

        {/* Bottom Admin Section */}
        <div className="bg-white rounded-[62px] border border-[#edf1f1] px-3 py-2 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="font-medium text-[#1e293b]">{user?.fullName}</span>
              <span className="text-xs text-[#64748b]">admin@univ-mosta.dz</span>
            </div>
          </div>
          <button onClick={logout} className="p-1">
            <img src={logoutImg} alt="Logout" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-row items-center justify-between ml-[288px] px-10 py-5">
        <div>
          <h1 className="text-2xl font-semibold text-[#1e293b] mb-1">All Books Management</h1>
          <p className="text-[#64748b] text-sm">Manage your library's book collection</p>
        </div>
        <div className="relative w-[400px]">
          <img src="/assets/images/icons/search-normal.png" alt="Search Icon" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50" />
          <input
            type="search"
            placeholder="Search by title, author, or department"
            className="w-full pl-12 pr-4 py-3 border border-[#e2e8f0] rounded-lg text-sm focus:border-[#25388c] focus:ring-1 focus:ring-[#25388c] focus:outline-none"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className='ml-[288px]'>
        <div className="bg-white rounded-2xl p-10 flex flex-col shadow-md overflow-y-auto mx-10 my-5">

          {mode === "list" ? (
            <>
              {/* List View */}
              <div className="flex justify-between items-center mb-8 w-full relative">
                <div className="flex items-center gap-4 absolute left-0">
                  <h2 className="text-xl font-semibold">Books List</h2>
                  <span className="text-[#64748b] text-sm">
                    {totalBooks} {totalBooks === 1 ? 'book' : 'books'}
                  </span>
                </div>
                <div className="flex gap-4 absolute right-0">
                  <select
                    className="px-4 py-2 border border-[#e2e8f0] rounded-lg text-sm text-[#475569] cursor-pointer hover:border-[#25388c]"
                    value={selectedDepartment}
                    onChange={(e) => { setCurrentPage(0); setSelectedDepartment(e.target.value); }}
                  >
                    <option value="all">All Departments</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                  </select>
                  <select
                    className="px-4 py-2 border border-[#e2e8f0] rounded-lg text-sm text-[#475569] cursor-pointer hover:border-[#25388c]"
                    value={sortOrder}
                    onChange={(e) => { setCurrentPage(0); setSortOrder(e.target.value); }}
                  >
                    <option value="title">Sort by Title</option>
                    <option value="author">Sort by Author</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                  <button
                    onClick={() => setMode("add")}
                    className="px-4 py-2 bg-[#25388c] text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-[#1e2a6d] transition"
                  >
                    <img src={plusBook} alt="Add" className="w-4 h-4 filter brightness-0 invert" />
                    Add New Book
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e2e8f0]">
                      <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">Book Info</th>
                      <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">Department</th>
                      <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">Date Added</th>
                      <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">Status</th>
                      <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.length > 0 ? (
                      books.map((book) => (
                        <BookItem key={book.id} book={book} deleteBook={() => deleteBook(book.id)} />
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-[#64748b]">
                          No books found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className='w-full mx-auto'>
                <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
              </div>
            </>
          ) : (
            <>
              {/* Add Book View */}
              <div className="flex justify-between items-center mb-8 w-full">
                <h2 className="text-xl font-semibold">Add New Book</h2>
                <button
                  onClick={() => setMode("list")}
                  className="px-4 py-2 border border-[#25388c] text-[#25388c] rounded-lg text-sm font-medium hover:bg-[#f1f5ff] transition"
                >
                  Go Back
                </button>
              </div>

              {/* Form Fields */}
              <form className="flex flex-col gap-4" onSubmit={(e) => {
                e.preventDefault();
                saveBook();
              }}>
                <div className="flex flex-col items-start gap-2 w-full">
                  <label htmlFor={"title"} className={`w-full text-base leading-6`}>Title</label>
                  <input required
                    className={`flex items-center justify-center h-[50px] px-3 py-2 w-full border p-3 rounded-lg text-base leading-6`}
                    id={"title"}
                    type={"text"}
                    placeholder={"Book Title"}
                    value={bookData.title}
                    onChange={(e) => { setBookData(prev => ({ ...prev, title: e.target.value })) }}
                  />
                  {/* {errors && (
                <span className="text-[#ff4d4d] text-xs mt-1"></span>
              )} */}
                </div>

                <div className="flex flex-col items-start gap-2 w-full">
                  <label htmlFor={"author"} className={`w-full text-base leading-6`}>Author</label>
                  <input required
                    className={`flex items-center justify-center h-[50px] px-3 py-2 w-full border p-3 rounded-lg text-base leading-6`}
                    id={"author"}
                    type={"text"}
                    placeholder={"Author"}
                    value={bookData.author}
                    onChange={(e) => { setBookData(prev => ({ ...prev, author: e.target.value })) }}
                  />
                  {/* {errors && (
                <span className="text-[#ff4d4d] text-xs mt-1"></span>
              )} */}
                </div>
                <div className="flex flex-col items-start gap-2 w-full">
                  <label htmlFor={"publisher"} className={`w-full text-base leading-6`}>Publisher</label>
                  <input required
                    className={`flex items-center justify-center h-[50px] px-3 py-2 w-full border p-3 rounded-lg text-base leading-6`}
                    id={"publisher"}
                    type={"text"}
                    placeholder={"Publisher"}
                    value={bookData.publisher}
                    onChange={(e) => { setBookData(prev => ({ ...prev, publisher: e.target.value })) }}
                  />
                  {/* {errors && (
                <span className="text-[#ff4d4d] text-xs mt-1"></span>
              )} */}
                </div>
                <div className="flex flex-col items-start gap-2 w-full">
                  <label htmlFor={"editionYear"} className={`w-full text-base leading-6`}>Edition Year</label>
                  <input required
                    className={`flex items-center justify-center h-[50px] px-3 py-2 w-full border p-3 rounded-lg text-base leading-6`}
                    id={"editionYear"}
                    type={"number"}
                    max={new Date().getFullYear()}
                    min={0}
                    placeholder={"Edition Year"}
                    value={bookData.editionYear}
                    onChange={(e) => { setBookData(prev => ({ ...prev, editionYear: e.target.value })) }}
                  />
                  {/* {errors && (
                <span className="text-[#ff4d4d] text-xs mt-1"></span>
              )} */}
                </div>
                <div className="flex flex-col items-start gap-2 w-full">
                  <label htmlFor={"isbn"} className={`w-full text-base leading-6`}>Isbn</label>
                  <input required
                    className={`flex items-center justify-center h-[50px] px-3 py-2 w-full border p-3 rounded-lg text-base leading-6`}
                    id={"isbn"}
                    type={"text"}
                    placeholder={"Isbn"}
                    value={bookData.isbn}
                    onChange={(e) => { setBookData(prev => ({ ...prev, isbn: e.target.value })) }}
                    onBlur={validateIsbn}
                  />
                  {errors.isbn && (
                    <span className="text-[#ff4d4d] text-xs mt-1">{errors.isbn}</span>
                  )}
                </div>
                <div className="flex flex-col items-start gap-2 w-full">
                  <label htmlFor={"cote"} className={`w-full text-base leading-6`}>Cote</label>
                  <input required
                    className={`flex items-center justify-center h-[50px] px-3 py-2 w-full border p-3 rounded-lg text-base leading-6`}
                    id={"cote"}
                    type={"text"}
                    placeholder={"Cote"}
                    value={bookData.cote}
                    onChange={(e) => { setBookData(prev => ({ ...prev, cote: e.target.value })) }}
                    onBlur={validateCote}
                  />
                  {errors.cote !== "" && (
                    <span className="text-[#ff4d4d] text-xs mt-1">{errors.cote}</span>
                  )}
                </div>
                <div className="flex flex-col items-start gap-2 w-full">
                  <label htmlFor={"numberOfCopies"} className={`w-full text-base leading-6`}>Number Of Copies</label>
                  <input required
                    className={`flex items-center justify-center h-[50px] px-3 py-2 w-full border p-3 rounded-lg text-base leading-6`}
                    id={"numberOfCopies"}
                    type={"number"}
                    placeholder={"Number Of Copies"}
                    value={bookData.numberOfCopies}
                    onChange={(e) => { setBookData(prev => ({ ...prev, numberOfCopies: e.target.value })) }}
                  />
                  {/* {errors && (
                <span className="text-[#ff4d4d] text-xs mt-1"></span>
              )} */}
                </div>
                <select className="border p-3 rounded-lg" onChange={(e) => { setBookData(prev => ({ ...prev, department: e.target.value })) }}>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#25388c] text-white rounded-lg text-sm font-medium hover:bg-[#1e2a6d] transition"
                >
                  Save Book
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
