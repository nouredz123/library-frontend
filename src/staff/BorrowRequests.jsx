import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ChevronDown, ChevronUp, Filter, Search } from 'lucide-react';
import AdminSideBar from '../components/AdminSideBar';
import Pagination from '../components/Pagination';

const apiUrl = import.meta.env.VITE_API_URL;

const BorrowRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);
  const [modalRequest, setModalRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ field: 'addedDate', direction: 'desc' });

  useEffect(() => {
    fetchRequests(selectedStatus, sortConfig);
  }, [selectedStatus, currentPage, sortConfig]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const performSearch = () => {
    setCurrentPage(0);
    fetchRequests(selectedStatus, sortConfig);
  };
  const fetchRequests = async (status = "pending", sort = "newest") => {
    const user = JSON.parse(localStorage.getItem("user"));
    let sortBy = "addedDate";
    let direction = "asc";

    if (sort === "oldest") {
      direction = "desc";
    }

    const params = new URLSearchParams();
    if (status !== "all") params.append("status", status);
    if (searchQuery) params.append("keyword", searchQuery);
    params.append("page", currentPage);
    params.append("sortBy", sortBy);
    params.append("direction", direction);

    try {
      setIsLoading(true);
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
        setRequests([]);
        throw new Error(`Failed to fetch requests`);
      }

      const data = await response.json();
      console.log("borrowings: ", data);
      setRequests(data.content);
      setTotalPages(data.totalPages);
      setTotalRequests(data.totalElements);

    } catch (error) {
      console.log(`Error fetching requests:`, error);
    }finally{
      setIsLoading(false);
    }
  };

  const reviewRequest = async (requestId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("statusss: ", modalRequest.status);
    const newStatus = modalRequest.status === "PENDING" ? "PICKED_UP" : "RETURNED";

    const params = new URLSearchParams();
    params.append("status", newStatus);

    try {
      const response = await fetch(`${apiUrl}/api/staff/reviewBorrowRequest/${requestId}?${params.toString()}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${user?.token || ''}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update request status");
      }
      closeModal();
      toast.success(
        `Book successfully marked as ${newStatus === "PICKED_UP" ? "picked up" : "returned"}`
      );
    } catch (error) {
      console.log(`Error updating request:`, error);
      toast.error(error.message);
    } finally {
      fetchRequests(selectedStatus, sortOrder);
    }
  };


  const handleSort = (field) => {
    setSortConfig(prevConfig => {
      if (prevConfig.field === field) {
        return {
          field,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { field, direction: 'asc' };
    });
  };


  const openModal = (request) => {
    setModalRequest(request);
  };

  const closeModal = () => {
    setModalRequest(null);
  };

  // Format date 
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  // Get status badge style
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "PENDING":
        return 'bg-[#fff7ed] text-[#c2410c]';
      case "PICKED_UP":
        return 'bg-[#e0f2fe] text-[#0369a1]';
      case "RETURNED":
        return 'bg-[#f0fdf4] text-[#15803d]';
      default:
        return 'bg-[#fef2f2] text-[#dc2626]';
    }
  };

  return (
    <div className="bg-[#f8f8ff] rounded-2xl relative min-h-screen overflow-y-auto">
      <AdminSideBar />

      <div className="ml-[288px] px-10 py-5">
        <div className="flex flex-row items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#1e293b] mb-1">Book Borrow Requests</h1>
            <p className="text-[#64748b] text-sm">Manage book borrowing requests</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative w-[300px]">
              <input
                type="search"
                placeholder="Search by book title or member name"
                className="w-full pl-10 pr-4 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:border-[#25388c] focus:ring-1 focus:ring-[#25388c] focus:outline-none"
                value={searchQuery}
                onChange={handleSearch}
                onKeyDown={(e) => e.key === 'Enter' && performSearch()}
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
                <label className="block text-sm font-medium text-[#475569] mb-1">Status</label>
                <select
                  className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm w-[150px]"
                  value={selectedStatus}
                  onChange={(e) => { setCurrentPage(0); setSelectedStatus(e.target.value); }}
                >
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="PICKED_UP">Picked Up</option>
                  <option value="RETURNED">Returned</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-1">Sort By</label>
                <select
                  className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm w-[150px]"
                  value={`${sortConfig.field}-${sortConfig.direction}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split('-');
                    setSortConfig({ field, direction });
                  }}
                >
                  <option value="addedDate-desc">Newest First</option>
                  <option value="addedDate-asc">Oldest First</option>
                  <option value="returnDate-asc">Due Date (Nearest)</option>
                  <option value="returnDate-desc">Due Date (Furthest)</option>
                </select>
              </div>
              <div className="flex items-end gap-3">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedStatus('all');
                    setSortConfig({ field: 'addedDate', direction: 'desc' });
                    setCurrentPage(0);
                    setTimeout(() => fetchRequests('all', { field: 'addedDate', direction: 'desc' }), 0);
                  }}
                  className="px-4 py-2 border border-[#e2e8f0] rounded-lg text-sm hover:bg-gray-100"
                >
                  Clear Filters
                </button>
                <button
                  onClick={performSearch}
                  className="px-4 py-2 bg-[#25388c] text-white rounded-lg text-sm hover:bg-[#1e2a6d]"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="bg-white rounded-2xl p-6 shadow-md my-5">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">Requests List</h2>
              <span className="text-[#64748b] text-sm">
                {isLoading ? "Loading..." : `${totalRequests} ${totalRequests === 1 ? 'request' : 'requests'}`}
              </span>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#25388c]"></div>
            </div>
          )}

          {/* Table */}
          {!isLoading && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e2e8f0]">
                    <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">Member</th>
                    <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">Book Details</th>
                    <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">Cote</th>
                    <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">
                      <button
                        onClick={() => handleSort('addedDate')}
                        className="flex items-center gap-1 hover:text-[#25388c]"
                      >
                        Request Date
                        {sortConfig.field === 'addedDate' &&
                          (sortConfig.direction === 'asc' ?
                            <ChevronUp className="h-4 w-4" /> :
                            <ChevronDown className="h-4 w-4" />)
                        }
                      </button>
                    </th>
                    <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">
                      <button
                        onClick={() => handleSort('returnDate')}
                        className="flex items-center gap-1 hover:text-[#25388c]"
                      >
                        Due Date
                        {sortConfig.field === 'returnDate' &&
                          (sortConfig.direction === 'asc' ?
                            <ChevronUp className="h-4 w-4" /> :
                            <ChevronDown className="h-4 w-4" />)
                        }
                      </button>
                    </th>
                    <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">Status</th>
                    <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(requests) && requests.length > 0 ? (
                    requests.map((request) => (
                      <tr key={request.id} className="border-b border-[#e2e8f0] hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <p className="font-medium text-[#1e293b]">{request.member.fullName}</p>
                          <p className="text-sm text-[#64748b]">{request.member.identifier}</p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={request.bookCopy?.book?.coverUrl || "/default-book.png"}
                              alt={request.bookCopy?.book?.title}
                              className="w-12 h-16 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium text-[#1e293b]">{request.bookCopy?.book?.title}</p>
                              <p className="text-sm text-[#64748b]">{request.bookCopy?.book?.author}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <p className="font-medium text-[#475569]">{request.bookCopy.inventoryNumber}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-[#475569]">{formatDate(request.addedDate)}</td>
                        <td className="px-4 py-4 text-sm text-[#475569]">{formatDate(request.returnDate)}</td>
                        <td className="px-4 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(request.status)}`}>
                            {request.status === "PICKED_UP" ? "picked up" : request.status.toLowerCase()}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          {request.status === "PENDING" && (
                            <button
                              onClick={() => openModal(request)}
                              className="px-3 py-2 bg-[#e0e7ff] text-[#4338ca] rounded text-sm hover:bg-[#c7d2fe]"
                            >
                              Mark as Picked Up
                            </button>
                          )}
                          {request.status === "PICKED_UP" && (
                            <button
                              onClick={() => openModal(request)}
                              className="px-3 py-2 bg-[#dcfce7] text-[#15803d] rounded text-sm hover:bg-[#bbf7d0]"
                            >
                              Mark as Returned
                            </button>
                          )}
                          {request.status === "RETURNED" && (
                            <span className="text-sm text-[#64748b]">Completed</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-[#64748b]">
                        {searchQuery || selectedStatus !== 'all'
                          ? "No matching requests found"
                          : "No requests available"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {!isLoading && totalPages > 1 && <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />}

        </div>
      </div>

      {/* Confirmation Modal */}
      {modalRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-[500px] w-full">
            <h3 className="text-lg font-semibold mb-4">
              {modalRequest.status === "PENDING" ? "Confirm Book Pick Up" : "Confirm Book Return"}
            </h3>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={modalRequest.bookCopy.book?.coverImage || "/default-book.png"}
                  alt={modalRequest.bookCopy.book.title}
                  className="w-16 h-20 object-cover rounded"
                />
                <div>
                  <p className="font-medium text-[#1e293b]">{modalRequest.bookCopy.book.title}</p>
                  <p className="text-sm text-[#64748b]">{modalRequest.bookCopy.book.author}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-[#475569] mb-2">
                  <span className="font-medium">Member: </span>
                  {modalRequest.member.fullName}
                </p>
                <p className="text-sm text-[#475569] mb-2">
                  <span className="font-medium">ID: </span>
                  {modalRequest.member.identifier}
                </p>
                <p className="text-sm text-[#475569]">
                  <span className="font-medium">Due Date: </span>
                  {formatDate(modalRequest.returnDate)}
                </p>
              </div>
              <p className="text-sm text-[#475569]">
                Are you sure you want to mark this book as
                {modalRequest.status === "PENDING" ? " picked up" : " returned"}?
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-[#e2e8f0] rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => reviewRequest(modalRequest.id)}
                className={`px-4 py-2 text-white rounded-lg text-sm ${modalRequest.status === "PENDING"
                  ? "bg-[#4338ca] hover:bg-[#3730a3]"
                  : "bg-[#15803d] hover:bg-[#166534]"
                  }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowRequests;