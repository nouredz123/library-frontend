import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import home from '../assets/home.png';
import profile from '../assets/profile-2user.png';
import book from '../assets/book.png';
import borrow from '../assets/bookmark-2.png';
import userIcon from '../assets/user.png';
import logoutImg from '../assets/logout.png';
import plusBook from '../assets/Plusbook.png';
import toast from 'react-hot-toast';
export default function AccountRequests() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(0);
    const [modalUser, setModalUser] = useState(null);
    const [requests, setRequests] = useState([]);
    const [totalRequests, setTotalRequests] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [newStatus, setNewStatus] = useState("Approved");

    const handleSearch = (e) => setSearchQuery(e.target.value);

    const openModal = (user) => {setNewStatus("Approved"), setModalUser(user)};
    const closeModal = () => setModalUser(null);

    const logout = () => {
        localStorage.removeItem("user");
        navigate("/sign-in",{replace: true});
        console.log('Logging out...');
        window.history.pushState(null, "", window.location.href);
        window.onpopstate = function() {
        window.history.pushState(null, "", window.location.href);
        };
    };
    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user")));
        fetchAccountRequests(selectedStatus);
    }, [selectedStatus, currentPage]);
  
    const fetchAccountRequests = async(status = "all")=>{
        const user = JSON.parse(localStorage.getItem("user"));
        let sortBy = "joinDate";
        let direction = "desc";

        const params = new URLSearchParams();
        if (status !== "all") params.append("status", status);
        params.append("page", currentPage);
        params.append("sortBy", sortBy);
        params.append("direction", direction);
        try {
        const response = await fetch(`http://localhost:8080/api/staff/accountRequests?${params.toString()}`,{
            method: "GET",
            headers: {
            'Content-type': 'application/json',
            "Authorization": `Bearer ${user?.token || ''}`
            }
        });
        const data = await response.json();
        if (!response.ok) {
            if(data.error){
                setRequests([]);
                setTotalPages(0);
                setTotalRequests(0);
                throw new Error(data.error);
            }
            throw new Error(`Failed to fetch requests`);
        }
        
        
        console.log(data);
        setRequests(data._embedded.userList);
        setTotalPages(data.page.totalPages);
        setTotalRequests(data.page.totalElements);
        
        } catch (error) {
        console.log(`Error fetching requests:`, error);
        
        }
    }
    const reviewAccount = async(userId)=>{
        const user = JSON.parse(localStorage.getItem("user"));
        console.log(user);

        const params = new URLSearchParams();
        params.append("status",newStatus);
        try {
        const response = await fetch(`http://localhost:8080/api/staff/reviewAccount/${userId}?${params.toString()}`,{
            method: "PATCH",
            headers: {
            "Authorization": `Bearer ${user?.token || ''}`
            }
        });
        const data = await response.json();
        if (!response.ok) {
            if(data.error){
                console.log(data.error);
            }
            throw new Error(`Failed to fetch requests`);
        }
        console.log(data);
        fetchAccountRequests(selectedStatus);
        closeModal();
        toast.success('Account reviewed successfully.');
        } catch (error) {
        console.log(`Error fetching requests:`, error);
        
        }
    }
    

  return (
    <div className="bg-[#f8f8ff] rounded-2xl relative min-h-screen overflow-y-auto">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-[288px] bg-white border-r border-[#edf1f1] flex flex-col justify-between p-4">
        {/* Top Section */}
        <div>
          <div className="py-5 flex flex-row gap-1.5 items-center">
            <img src={logo} alt="BookFSEI Logo" className="w-10 h-10" />
            <div className="text-[#25388c] font-semibold text-[26px] leading-6">BookFSEI</div>
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
            <Link to="/staff/allbooks" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#f8fafc] cursor-pointer">
              <img src={book} alt="Books Icon" className="w-5 h-5" />
              <p className="text-[#475569] text-sm font-medium">All Books</p>
            </Link>
            <Link to="/staff/borrowrequests" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#f8fafc] cursor-pointer">
              <img src={borrow} alt="Borrow Icon" className="w-5 h-5" />
              <p className="text-[#475569] text-sm font-medium">Borrow Requests</p>
            </Link>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#25388c] cursor-pointer">
              <img src={userIcon} alt="Account Icon" className="w-5 h-5 filter brightness-0 invert" />
              <p className="text-white text-sm font-medium">Account Requests</p>
            </div>
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
          <h1 className="text-2xl font-semibold text-[#1e293b] mb-1">Account Requests</h1>
          <p className="text-[#64748b] text-sm">Manage user account approval requests</p>
        </div>
        <div className="relative w-[400px]">
          <img src={"searchIcon"} alt="Search Icon" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50" />
          <input
            type="search"
            placeholder="Search by name, email, or ID"
            className="w-full pl-12 pr-4 py-3 border border-[#e2e8f0] rounded-lg text-sm focus:border-[#25388c] focus:ring-1 focus:ring-[#25388c] focus:outline-none"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Content Section */}
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
                onChange={(e)=>{setCurrentPage(0); setSelectedStatus(e.target.value); }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e2e8f0]">
                  <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">Member Details</th>
                  <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">University ID</th>
                  <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">Join Date</th>
                  <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">Status</th>
                  <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.length > 0 ? (
                  requests.map((req) => (
                    <tr key={req.id} className="border-b border-[#e2e8f0]">
                        <td className="px-4 py-4">
                            <p className="font-medium text-[#1e293b]">{req.fullName}</p>
                            <p className="text-[#64748b] text-sm">{req.email}</p>
                        </td>
                        <td className="px-4 py-4 text-sm text-[#475569]">{req.identifier}</td>
                        <td className="px-4 py-4 text-sm text-[#475569]">{req.joinDate}</td>
                        <td className="px-4 py-4 text-sm text-[#475569]">
                            <span className={`px-4 py-1 rounded-full text-xs font-medium ${
                            req.accountStatus === "APPROVED" 
                                ? 'bg-[#f0fdf4] text-[#15803d]' 
                                : req.accountStatus === "PENDING"
                                    ? 'bg-[#fff7ed] text-[#c2410c]'
                                    : 'bg-[#fee2e2] text-[#dc2626]'
                            }`}>
                            {req.accountStatus === "APPROVED" 
                                ? 'Approved' 
                                : req.accountStatus === "PENDING"
                                    ? 'Pending'
                                    : 'Rejected'}
                            </span>
                        </td>
                        <td className="px-4 py-4">
                            <button onClick={() => openModal(req)} className="px-3 py-1.5 bg-[#25388c] text-white rounded-lg text-xs font-medium hover:bg-[#1e2a6d] transition">
                            Review Request
                            </button>
                        </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-[#64748b]">No requests found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modal */}
          {modalUser && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 w-[500px] shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Review Account Request</h3>
                <div className="mb-4">
                  <p className="font-medium text-[#1e293b]">{modalUser.fullName}</p>
                  <p className="text-[#64748b] text-sm">{modalUser.email}</p>
                  <p className="text-sm text-[#475569] mt-2">University ID: {modalUser.identifier}</p>
                </div>
                <select className="w-full border border-[#e2e8f0] rounded-lg text-sm px-4 py-2 mb-4" defaultValue={modalUser.AccountStatus}
                    onChange={(e)=>setNewStatus(e.target.value)}
                >
                  <option value="approved">Approve</option>
                  <option value="rejected">Reject</option>
                </select>
                <div className="flex justify-end gap-2">
                  <button onClick={closeModal} className="px-4 py-2 border border-[#e2e8f0] rounded-lg text-sm">Cancel</button>
                  <button className="px-4 py-2 bg-[#25388c] text-white rounded-lg text-sm hover:bg-[#1e2a6d]"
                    onClick={() => reviewAccount(modalUser.id)}
                  >Submit</button>
                </div>
              </div>
            </div>
          )}

          <div className='w-full mx-auto'>
            {/* Pagination Component here */}
          </div>
        </div>
      </div>
    </div>
  );
}
