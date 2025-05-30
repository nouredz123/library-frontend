import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuBook, PersonAdd, CalendarToday, Add, ChevronRight, People, Bookmark } from '@mui/icons-material';
import StateCard from '../components/StateCard';
import AdminSideBar from '../components/AdminSideBar';
import CoverImage from '../components/CoverImage';

const apiUrl = import.meta.env.VITE_API_URL;

export default function StaffDashboard() {
  const [insights, setInsights] = useState({
    pendingAccountRequests: 0,
    activeBorrowings: 0,
    availableBooks: 0,
    activeUsers: 0,
  });
  const [recentBooks, setRecentBooks] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [recentAccountRequests, setRecentAccountRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    fetchInsights();
    fetchRecentBooks();
    fetchRecentRequests();
    fetchRecentAccountRequests();
  }, []);

  const fetchInsights = async () => {
    setIsLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await fetch(`${apiUrl}/api/staff/insights`, {
        method: "GET",
        headers: {
          'Content-type': 'application/json',
          "Authorization": `Bearer ${user?.token || ''}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch insights`);
      }

      const data = await response.json();
      setInsights(data);
    } catch (error) {
      console.log(`Error fetching insights:`, error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchRecentBooks = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    let sortBy = "addedDate";
    let direction = "desc";
    const params = new URLSearchParams();
    params.append("page", 0);
    params.append("size", 3)
    params.append("sortBy", sortBy);
    params.append("direction", direction);

    try {
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
      setRecentBooks(data.content);
    } catch (error) {
      console.log(`Error fetching books:`, error);
    }
  }

  const fetchRecentRequests = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    let sortBy = "addedDate";
    let direction = "asc";

    const params = new URLSearchParams();
    params.append("status", "PENDING");
    params.append("page", 0);
    params.append("size", 10);
    params.append("sortBy", sortBy);
    params.append("direction", direction);

    try {
      const response = await fetch(`${apiUrl}/api/staff/borrowings?${params.toString()}`, {
        method: "GET",
        headers: {
          'Content-type': 'application/json',
          "Authorization": `Bearer ${user?.token || ''}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        console.log(data);
        setRecentRequests([]);
        throw new Error(`Failed to fetch requests`);
      }

      const data = await response.json();
      console.log("borrowings: ", data);
      setRecentRequests(data.content);

    } catch (error) {
      console.log(`Error fetching requests:`, error);
    }
  }

  const fetchRecentAccountRequests = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const params = new URLSearchParams();
    params.append("status", "PENDING");
    params.append("page", 0);
    params.append("size", 3);
    params.append("sortBy", "joinDate");
    params.append("direction", "desc");

    try {
      const response = await fetch(`${apiUrl}/api/staff/accountRequests?${params.toString()}`, {
        method: "GET",
        headers: {
          'Content-type': 'application/json',
          "Authorization": `Bearer ${user?.token || ''}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.error) {
          setRequests([]);
          throw new Error(data.error);
        }
        throw new Error(`Failed to fetch requests`);
      }

      console.log(data);
      setRecentAccountRequests(data.content);

    } catch (error) {
      console.log(`Error fetching requests:`, error);
    }
  }

  const viewAll = (type) => {
    switch (type) {
      case 'borrow':
        navigate('/staff/borrowrequests');
        break;
      case 'books':
        navigate('/staff/AllBooks');
        break;
      case 'accounts':
        navigate('/staff/accountRequests');
        break;
      default:
        break;
    }
  };



  return (
    <div className="bg-[#f8f8ff] min-h-screen">
      <AdminSideBar />

      {/* Main Content */}
      <div className="ml-[288px] px-10 py-5">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#1e293b] mb-1">Hello, Admin</h1>
          <p className="text-[#64748b] text-sm">Main control panel for monitoring and managing the library</p>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StateCard
            title="Pending Account Requests"
            value={insights.pendingAccountRequests}
            icon={<PersonAdd style={{ color: '#4f46e5' }} />}
            bgColor="bg-indigo-100"
            isLoading={isLoading}
          />
          <StateCard
            title="Active Borrowings"
            value={insights.activeBorrowings}
            icon={<Bookmark style={{ color: '#059669' }} />}
            bgColor="bg-emerald-100"
            isLoading={isLoading}
          />
          <StateCard
            title="Available Books"
            value={insights.availableBooks}
            icon={<MenuBook style={{ color: '#2563eb' }} />}
            bgColor="bg-blue-100"
            isLoading={isLoading}
          />
          <StateCard
            title="Active Users"
            value={insights.activeUsers}
            icon={<People style={{ color: '#d97706' }} />}
            bgColor="bg-amber-100"
            isLoading={isLoading}
          />
        </div>

        {/* Borrow Requests */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[#1e293b]">Borrow Requests</h2>
            <button
              onClick={() => viewAll('borrow')}
              className="text-sm font-medium text-[#25388c] hover:text-indigo-800 flex items-center"
            >
              View All <ChevronRight fontSize="small" />
            </button>
          </div>

          {
            recentRequests.length > 0 ? (
              <div className="border rounded-lg divide-y">
                {recentRequests.map((req, index) => (
                  <div key={req} className="flex items-center justify-between p-4 hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="ml-3">
                        <p className="font-medium text-[#1e293b]">{req.member.fullName}</p>
                        <p className="text-sm text-[#64748b]">{req.bookCopy.inventoryNumber}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-gray-100 p-6 rounded-full mb-4">
                  <Bookmark style={{ color: '#9ca3af', fontSize: 32 }} />
                </div>
                <h3 className="text-[#1e293b] font-medium mb-2">No Pending Borrow Requests</h3>
                <p className="text-[#64748b] max-w-md">There are no book borrowing requests awaiting your review at this time.</p>
              </div>
            )
          }
        </div>

        {/* Recently Added Books */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[#1e293b]">Recently Added Books</h2>
            <button
              onClick={() => viewAll('books')}
              className="text-sm font-medium text-[#25388c] hover:text-indigo-800 flex items-center"
            >
              View All <ChevronRight fontSize="small" />
            </button>
          </div>

          <div className={`${recentBooks.length > 0 ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" : "flex gap-16"} min-h-48`}>
            {/* Add Book Card */}
            <div
              onClick={() => navigate('/staff/AllBooks', { state: { mode: "add" } })}
              className="border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-all duration-300"
            >
              <div className="bg-gray-100 p-3 rounded-full mb-3">
                <Add style={{ color: '#6b7280', fontSize: 24 }} />
              </div>
              <h3 className="font-medium text-[#1e293b]">Add New Book</h3>
              <p className="text-sm text-[#64748b] mt-1">Click to add a new book to the library</p>
            </div>

            {recentBooks.length > 0 ? (
              recentBooks.map((book) => (
                <div key={book.id} className="border border-gray-200 rounded-xl overflow-hidden flex flex-col hover:shadow-md transition-all duration-300">
                  <div className="h-44 bg-gray-200 flex items-center justify-center">
                    <CoverImage coverUrl={book?.coverUrl} title={book.title} size={86} />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-[#1e293b] mb-1 line-clamp-1">{book.title}</h3>
                    <p className="text-sm text-[#64748b] mb-2">{book.author}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium bg-blue-100 text-blue-600 px-2 py-1 rounded-full">{book.department.split(',')[0]}</span>
                      <div className="flex items-center text-xs text-[#64748b]">
                        <CalendarToday style={{ fontSize: 12, marginRight: 4 }} />
                        {book.addedDate}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex  items-center justify-center py-12 text-center">
                <h3 className="text-[#1e293b] font-medium mb-2">There are no recently added books</h3>
              </div>
            )}
          </div>
        </div>

        {/* Account Requests */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[#1e293b]">Account Requests</h2>
            <button
              onClick={() => viewAll('accounts')}
              className="text-sm font-medium text-[#25388c] hover:text-indigo-800 flex items-center"
            >
              View All <ChevronRight fontSize="small" />
            </button>
          </div>

          {/* Account requests list - with consistent styling */}
          <div className="border rounded-lg divide-y">
            {recentAccountRequests.length > 0 ? (recentAccountRequests.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="font-medium text-[#1e293b]">{item.fullName}</p>
                    <p className="text-sm text-[#64748b]">{item.email}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1.5 bg-[#25388c] text-white rounded-lg text-xs font-medium hover:bg-[#1e2a6d] transition flex items-center"
                    onClick={() => {
                      navigate('/staff/accountRequests', { state: { selectedRequest: item } });
                    }}
                  >
                    Review
                  </button>
                </div>
              </div>
            ))) : (
              <div className="flex  items-center justify-center py-12 text-center">
                <h3 className="text-[#1e293b] font-medium mb-2">There are no pending account requests</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}