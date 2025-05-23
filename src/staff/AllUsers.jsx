import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import home from '../assets/home.png';
import profile from '../assets/profile-2user.png';
import book from '../assets/book.png';
import borrow from '../assets/bookmark-2.png';
import user from '../assets/user.png';
import logoutImg from '../assets/logout.png';
import UserItem from '../components/UserItem';
import toast from 'react-hot-toast';
import AdminSideBar from '../components/AdminSideBar';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailModal, setDetailModal] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const openDetailModal = (user) => setDetailModal(user);
  const closeDetailModal = () => setDetailModal(null);

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };


  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    console.log("fetching");
    fetchUsers(selectedRole, sortOrder);
  }, [selectedRole, sortOrder]);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/sign-in", { replace: true });
    console.log('Logging out...');
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  };

  const fetchUsers = async (role = "all", sort = "newest") => {
    const user = JSON.parse(localStorage.getItem("user"));
    let sortBy = "joinDate";
    let direction = "desc";

    if (sort === "oldest") {
      sortBy = "joinDate";
      direction = "asc";
    } else if (sort === "name") {
      sortBy = "fullName";
      direction = "asc";
    }

    const params = new URLSearchParams();
    if (role !== "all") params.append("role", role);
    params.append("page", 0);
    params.append("sortBy", sortBy);
    params.append("direction", direction);
    try {
      const response = await fetch(`http://localhost:8080/api/staff/users?${params.toString()}`, {
        method: "GET",
        headers: {
          'Content-type': 'application/json',
          "Authorization": `Bearer ${user?.token || ''}`
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch  users`);
      }

      const data = await response.json();
      console.log(data);
      setUsers(data._embedded.userResponseList);
      console.log("fetching done");

    } catch (error) {
      console.log(`Error fetching users:`, error);
    }
  }
  const handleOpenDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };
  const handleConfirmDelete = () => {
    if (selectedUser) {
      deleteUser(selectedUser);
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
  };
  const deleteUser = async (user) => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    console.log("token:", user.token);
    try {
      const response = await fetch(`http://localhost:8080/api/staff/deleteUser/${user.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${currentUser?.token || ''}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete the user");
      }

      console.log(data);
      toast.success(`🗑️ ${data.message}`);
      fetchUsers();
    } catch (error) {
      console.log(`Error deleting  the user:`, error);
      alert(error.message);
    }
  }
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  return (
    <div className="bg-[#f8f8ff] rounded-2xl relative min-h-screen overflow-y-auto">
      <AdminSideBar />

      {/* Main Content */}
      <div className="flex flex-row items-center justify-between ml-[288px] px-10 py-5">
        <div>
          <h1 className="text-2xl font-semibold text-[#1e293b] mb-1">All Users Management</h1>
          <p className="text-[#64748b] text-sm">View and manage all system users</p>
        </div>
        <div className="relative w-[400px]">
          <img src="/assets/images/icons/search-normal.png" alt="Search Icon" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50" />
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
              <h2 className="text-xl font-semibold">All Users</h2>
              <span className="text-[#64748b] text-sm">
                {/* {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} */}
              </span>
            </div>
            <div className="flex gap-4 absolute right-0">
              <select
                className="px-4 py-2 border border-[#e2e8f0] rounded-lg text-sm text-[#475569] cursor-pointer hover:border-[#25388c]"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="member">Members</option>
                <option value="staff">Staffs</option>
              </select>
              <select
                className="px-4 py-2 border border-[#e2e8f0] rounded-lg text-sm text-[#475569] cursor-pointer hover:border-[#25388c]"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
          {users && (
            <div></div>
          )}

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">User Details</th>
                  <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">University ID</th>
                  <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">Role</th>
                  <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">Date Joined</th>
                  <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">ID Card</th>
                  <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(users) && users.length > 0 ? (
                  users.map((user) => (
                    <UserItem key={user.id} user={user} onDeleteClick={handleOpenDeleteModal} openDetailModel={() => openDetailModal(user)} openImageModel={(e) => {
                        e.stopPropagation();
                        openImageModal(req.cardBase64 ? `data:${req.cardContentType};base64,${req.cardBase64}` : '/default-card.png');
                    }}/>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-[#64748b]">
                      No users found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Delete User Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-[360px] w-full">
                <h3 className="text-lg font-semibold mb-4">Delete User</h3>
                <div className="mb-6">
                  <p>Are you sure you want to delete this user?</p>
                  <p className="mt-2">Name: <span className="font-medium">{selectedUser?.fullName}</span></p>
                  <p>University ID: <span className="font-medium">{selectedUser?.identifier}</span></p>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleCancelDelete}
                    className="px-4 py-2 bg-[#f1f5f9] text-[#475569] rounded text-sm font-medium hover:bg-[#e2e8f0]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 bg-[#25388c] text-white rounded text-sm font-medium hover:bg-[#1e2a6d]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Image Preview Modal */}
          {selectedImage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 w-[500px] shadow-lg">
                <div className="flex justify-end">
                  <button onClick={closeImageModal} className="text-[#475569] text-lg font-semibold">
                    ×
                  </button>
                </div>
                <img
                  src={selectedImage}
                  alt="Large User Card"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          )}
          {/* Detailed View Modal */}
          {detailModal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
              <div className="bg-white rounded-2xl p-6 w-[800px] shadow-lg">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-semibold">User Details</h3>
                  <button onClick={closeDetailModal} className="text-[#475569] text-lg font-semibold">
                    ×
                  </button>
                </div>

                <div className="flex gap-8">
                  {/* Left side - User details */}
                  <div className="w-1/2">
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-[#64748b] mb-2">Personal Information</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-[#64748b]">Full Name</p>
                          <p className="font-medium">{detailModal.fullName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#64748b]">Email</p>
                          <p className="font-medium">{detailModal.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#64748b]">University ID</p>
                          <p className="font-medium">{detailModal.identifier}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#64748b]">Join Date</p>
                          <p className="font-medium">{formatDate(detailModal.joinDate)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-[#64748b] mb-2">Account Status</h4>
                      <span className={`px-4 py-2 rounded-full text-xs font-medium ${detailModal.accountStatus === "APPROVED"
                        ? 'bg-[#f0fdf4] text-[#15803d]'
                        : detailModal.accountStatus === "PENDING"
                          ? 'bg-[#fff7ed] text-[#c2410c]'
                          : 'bg-[#fee2e2] text-[#dc2626]'
                        }`}>
                        {detailModal.accountStatus === "APPROVED"
                          ? 'Approved'
                          : detailModal.accountStatus === "PENDING"
                            ? 'Pending'
                            : 'Rejected'}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeDetailModal();
                        openModal(detailModal);
                      }}
                      className="px-4 py-2 bg-[#25388c] text-white rounded-lg text-sm hover:bg-[#1e2a6d] transition"
                    >
                      Review Request
                    </button>
                  </div>

                  {/* Right side - Card image */}
                  <div className="w-1/2">
                    <h4 className="text-sm font-medium text-[#64748b] mb-4">University Card</h4>
                    <div className="border border-[#e2e8f0] rounded-lg p-4 flex justify-center items-center h-64">
                      <img
                        src={detailModal.cardBase64 ? `data:${detailModal.cardContentType};base64,${detailModal.cardBase64}` : '/default-card.png'}
                        alt="User Card"
                        className="max-w-full max-h-full object-contain"
                        onClick={(e) => {
                        e.stopPropagation();
                        openImageModal(detailModal.cardBase64 ? `data:${detailModal.cardContentType};base64,${detailModal.cardBase64}` : '/default-card.png');
                    }}
                      />
                    </div>
                    <p className="text-xs text-[#64748b] mt-2 text-center">Click on the image to view full size</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllUsers;