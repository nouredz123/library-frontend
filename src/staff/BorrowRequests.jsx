import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import home from '../assets/home.png';
import profile from '../assets/profile-2user.png';
import book from '../assets/book.png';
import borrow from '../assets/bookmark-2.png';
import user from '../assets/user.png';
import logoutImg from '../assets/logout.png';
import toast from 'react-hot-toast';
import AdminSideBar from '../components/AdminSideBar';

const BorrowRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);
  const [modalRequest, setModalRequest] = useState(null);
  const [newStatus, setNewStatus] = useState("APPROVED");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests(selectedStatus, sortOrder);
  }, [selectedStatus, sortOrder, currentPage]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const fetchRequests = async (status = "pending", sort = "newest") => {
    const user = JSON.parse(localStorage.getItem("user"));
    let sortBy = "addedDate";
    let direction = "desc";

    if (sort === "oldest") {
      direction = "asc";
    }

    const params = new URLSearchParams();
    if (status !== "all") params.append("status", status);
    params.append("page", currentPage);
    params.append("sortBy", sortBy);
    params.append("direction", direction);

    try {
      const response = await fetch(`http://localhost:8080/api/staff/borrowings?${params.toString()}`, {
        method: "GET",
        headers: {
          'Content-type': 'application/json',
          "Authorization": `Bearer ${user?.token || ''}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        console.log(data);
        toast.error(data.error);
        setRequests([]);
        throw new Error(`Failed to fetch requests`);
      }

      const data = await response.json();
      console.log(data);
      setRequests(data._embedded.borrowingList);
      setTotalPages(data.page.totalPages);
      setTotalRequests(data.page.totalElements);

    } catch (error) {
      console.log(`Error fetching requests:`, error);
    }
  };

  const reviewRequest = async (requestId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("statusss: ", modalRequest.status);
    const newStatus = modalRequest.status === "PENDING" ? "PICKED_UP" : "RETURNED";

    const params = new URLSearchParams();
    params.append("status", newStatus);

    try {
      const response = await fetch(`http://localhost:8080/api/staff/reviewBorrowRequest/${requestId}?${params.toString()}`, {
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
    } finally{
      fetchRequests(selectedStatus, sortOrder);
    }
  };

  const openModal = (request) => {
    setNewStatus("APPROVED");
    setModalRequest(request);
  };

  const closeModal = () => {
    setModalRequest(null);
  };

  return (
    <div className="bg-[#f8f8ff] rounded-2xl relative min-h-screen overflow-y-auto">
      <AdminSideBar />

      <div className="flex flex-row items-center justify-between ml-[288px] px-10 py-5">
        <div>
          <h1 className="text-2xl font-semibold text-[#1e293b] mb-1">Book Borrow Requests</h1>
          <p className="text-[#64748b] text-sm">Manage book borrowing requests</p>
        </div>
        <div className="relative w-[400px]">
          <input
            type="search"
            placeholder="Search by book title or member name"
            className="w-full pl-12 pr-4 py-3 border border-[#e2e8f0] rounded-lg text-sm focus:border-[#25388c] focus:ring-1 focus:ring-[#25388c] focus:outline-none"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className='ml-[288px]'>
        <div className="bg-white rounded-2xl p-10 flex flex-col shadow-md overflow-y-auto mx-10 my-5">
          <div className="flex justify-between items-center mb-8 w-full relative">
            <div className="flex items-center gap-4 absolute left-0">
              <h2 className="text-xl font-semibold">Requests List</h2>
              <span className="text-[#64748b] text-sm">{totalRequests} {totalRequests === 1 ? 'request' : 'requests'}</span>
            </div>
            <div className="flex gap-4 absolute right-0">
              <select
                className="px-4 py-2 border border-[#e2e8f0] rounded-lg text-sm text-[#475569] cursor-pointer hover:border-[#25388c]"
                value={selectedStatus}
                onChange={(e) => { setCurrentPage(0); setSelectedStatus(e.target.value); }}
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="PICKED_UP">Picked Up</option>
                <option value="RETURNED">Returned</option>
              </select>
              <select
                className="px-4 py-2 border border-[#e2e8f0] rounded-lg text-sm text-[#475569] cursor-pointer hover:border-[#25388c]"
                value={sortOrder}
                onChange={(e) => { setCurrentPage(0); setSortOrder(e.target.value); }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium">Student</th>
                  <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium">Book Details</th>
                  <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium">Request Date</th>
                  <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium">Due Date</th>
                  <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium">Status</th>
                  <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(requests) && requests.length > 0 ? (
                  requests.map((request) => (
                    <tr key={request.id} className="border-b border-[#e2e8f0]">
                      <td className="px-4 py-4">
                        <p className="font-medium text-[#1e293b]">{request.member.fullName}</p>
                        <p className="text-sm text-[#64748b]">{request.member.identifier}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={request.bookCopy.book?.coverImage || "/default-book.png"}
                            alt={request.bookCopy.book?.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium text-[#1e293b]">{request.bookCopy.book?.title}</p>
                            <p className="text-sm text-[#64748b]">{request.bookCopy.book?.author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-[#475569]">{request.addedDate}</td>
                      <td className="px-4 py-4 text-sm text-[#475569]">{request.returnDate}</td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${request.status === "BORROWED"
                            ? 'bg-[#e0f2fe] text-[#0369a1]'
                            : request.status === "PENDING"
                              ? 'bg-[#fff7ed] text-[#c2410c]'
                              : request.status === "RETURNED"
                                ? 'bg-[#f0fdf4] text-[#15803d]'
                                : 'bg-[#fef2f2] text-[#dc2626]'
                          }`}>
                          {request.status.toLowerCase()}
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
                      No requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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
                  <p className="text-sm text-[#475569] mb-2">
                    <span className="font-medium">Member: </span>
                    {modalRequest.member.fullName}
                  </p>
                  <p className="text-sm text-[#475569] mb-4">
                    <span className="font-medium">Due Date: </span>
                    {modalRequest.returnDate}
                  </p>
                  <p className="text-sm text-[#475569] mb-4">
                    Are you sure you want to mark this book as
                    {modalRequest.status === "PENDING" ? " picked up" : " returned"}?
                  </p>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-[#e2e8f0] rounded-lg text-sm"
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
      </div>
    </div>
  );
};

export default BorrowRequests;