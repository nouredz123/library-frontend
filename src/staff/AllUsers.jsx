import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ChevronDown, ChevronUp, Filter, Search } from 'lucide-react';
import AdminSideBar from '../components/AdminSideBar';
import Pagination from '../components/Pagination';
import UserDetailsModal from '../components/UserDetails';

const apiUrl = import.meta.env.VITE_API_URL;
const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("all");
  const [sortConfig, setSortConfig] = useState({ field: 'joinDate', direction: 'desc' });
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailModal, setDetailModal] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [shouldSearch, setShouldSearch] = useState(false);

  const openDetailModal = (user) => setDetailModal(user);
  const closeDetailModal = () => setDetailModal(null);

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };


  useEffect(() => {
    setShouldSearch(true);
  }, []);


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
  }, [selectedRole, sortConfig]);


  useEffect(() => {
    setShouldSearch(true);
  }, [currentPage]);


  useEffect(() => {
    if (shouldSearch) {
      fetchUsers();
      setShouldSearch(false);
    }
  }, [shouldSearch]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== "") {
      if (currentPage !== 0) {
        setCurrentPage(0);
      } else {
        setShouldSearch(true);
      }
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
    fetchUsers();
  };


  const fetchUsers = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    let sortBy = sortConfig.field;
    let direction = sortConfig.direction;

    const params = new URLSearchParams();
    if (selectedRole !== "all") params.append("role", selectedRole);
    if (searchQuery) params.append("keyword", searchQuery);
    params.append("page", currentPage);
    params.append("sortBy", sortBy);
    params.append("direction", direction);

    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/api/staff/users?${params.toString()}`, {
        method: "GET",
        headers: {
          'Content-type': 'application/json',
          "Authorization": `Bearer ${user?.token || ''}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.error) {
          toast.error(data.error);
          setUsers([]);
          setTotalPages(0);
          setTotalUsers(0);
          return
        }
        throw new Error();
      }

      setUsers(data.content);
      setTotalPages(data.totalPages);
      setTotalUsers(data.totalElements);

    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }

  const handleOpenDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedUser) {
      await deleteUser(selectedUser);
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
    try {
      const response = await fetch(`${apiUrl}/api/staff/deleteUser/${user.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${currentUser?.token || ''}`
        }

      });
      const data = await response.json();
      if (!response.ok) {
        if (data.error) {
          toast.error(data.error);
          return;
        }
        throw new Error("Failed to delete the user");
      }

      toast.success(`🗑️ ${data.message}`);
      fetchUsers();
    } catch (error) {
      toast.error(error.message);
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  // Get role label and style
  const getRoleLabel = (role) => {
    return role === "ROLE_MEMBER" ? "Member" : "Staff";
  };

  const getRoleColor = (role) => {
    return role === "ROLE_MEMBER"
      ? "bg-indigo-100 text-indigo-700"
      : "bg-purple-100 text-purple-700";
  };


  return (
    <div className="bg-[#f8f8ff] min-h-screen overflow-y-auto">
      <AdminSideBar />
      {/* Main Content */}
      <div className="ml-[288px] px-10 py-5">
        <div className="flex flex-row items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#1e293b] mb-1">Approved Users Management</h1>
            <p className="text-[#64748b] text-sm">View and manage all approved system users</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative w-[300px]">
              <input
                type="search"
                placeholder="Search by name, email, or ID"
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
                <label className="block text-sm font-medium text-[#475569] mb-1">Role</label>
                <select
                  className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm w-[150px]"
                  value={selectedRole}
                  onChange={(e) => { setCurrentPage(0); setSelectedRole(e.target.value); }}
                >
                  <option value="all">All Roles</option>
                  <option value="member">Members</option>
                  <option value="staff">Staffs</option>
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
                  <option value="joinDate-desc">Newest First</option>
                  <option value="joinDate-asc">Oldest First</option>
                  <option value="fullName-asc">Name (A-Z)</option>
                  <option value="fullName-desc">Name (Z-A)</option>
                </select>
              </div>
              <div className="flex items-end gap-3">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedRole('all');
                    setSortConfig({ field: 'joinDate', direction: 'desc' });
                    setCurrentPage(0);
                    setTimeout(() => fetchUsers(), 0);
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
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">Approved Users</h2>
              <span className="text-[#64748b] text-sm">
                {isLoading ? "Loading..." : `${totalUsers} ${totalUsers === 1 ? 'user' : 'users'}`}
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
            <div className="w-full overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">
                      <button
                        onClick={() => handleSort('fullName')}
                        className="flex items-center gap-1 hover:text-[#25388c]"
                      >
                        User Details
                        {sortConfig.field === 'fullName' &&
                          (sortConfig.direction === 'asc' ?
                            <ChevronUp className="h-4 w-4" /> :
                            <ChevronDown className="h-4 w-4" />)
                        }
                      </button>
                    </th>
                    <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">ID</th>
                    <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">Role</th>
                    <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">
                      <button
                        onClick={() => handleSort('joinDate')}
                        className="flex items-center gap-1 hover:text-[#25388c]"
                      >
                        Date Joined
                        {sortConfig.field === 'joinDate' &&
                          (sortConfig.direction === 'asc' ?
                            <ChevronUp className="h-4 w-4" /> :
                            <ChevronDown className="h-4 w-4" />)
                        }
                      </button>
                    </th>
                    <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">Card</th>
                    <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(users) && users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id} className="border-b border-[#e2e8f0] hover:bg-gray-50 cursor-pointer" onClick={() => openDetailModal(user)}>
                        <td className="px-4 py-4">
                          <p className="font-medium text-[#1e293b]">{user.fullName}</p>
                          <p className="text-[#64748b] text-sm">{user.email}</p>
                        </td>
                        <td className="px-4 py-4 text-sm text-[#475569]">{user.identifier || "N/A"}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {getRoleLabel(user.role)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-[#475569]">{formatDate(user.joinDate)}</td>
                        <td className="px-2 py-2 text-sm text-[#475569]">
                          {user.role === "ROLE_MEMBER" ? (
                            <img
                              src={`data:${user.cardContentType};base64,${user.cardBase64}`}
                              alt="University Card"
                              className="w-20 h-12 object-cover rounded-md"
                              onClick={(e) => {
                                e.stopPropagation();
                                openImageModal(`data:${user.cardContentType};base64,${user.cardBase64}`);
                              }}
                            />
                          ) : (
                            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              N/A
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openDetailModal(user);
                              }}
                              className="px-3 py-1.5 bg-[#25388c] text-white rounded-lg text-xs font-medium hover:bg-[#1e2a6d] transition"
                            >
                              View
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDeleteModal(user);
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
                        {searchQuery || selectedRole !== 'all'
                          ? "No matching users found"
                          : "No approved users available"}
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

      {/* Delete User Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-[360px] w-full">
            <h3 className="text-lg font-semibold mb-4">Delete User</h3>
            <div className="mb-6">
              <p>Are you sure you want to delete this user?</p>
              <p className="mt-2">Name: <span className="font-medium">{selectedUser?.fullName}</span></p>
              <p>{selectedUser?.role === "ROLE_MEMBER" ? "University ID" : "Admin Code"}: <span className="font-medium">{selectedUser?.identifier}</span></p>
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
                className="px-4 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={closeImageModal}>
          <div className="bg-white rounded-2xl p-6 w-[600px] max-w-90vw shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">University Card</h3>
              <button onClick={closeImageModal} className="text-[#475569] text-2xl font-semibold hover:text-black">
                ×
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg p-2">
              <img
                src={selectedImage}
                alt="University Card"
                className="w-full h-auto max-w-[500px] max-h-[500px] object-contain rounded-md"
              />
            </div>
          </div>
        </div>
      )}

      {/* Detailed View Modal */}
      {detailModal && (
        <UserDetailsModal user={detailModal} closeDetailModal={closeDetailModal} openModal={handleOpenDeleteModal} openImageModal={openImageModal} />
      )}
    </div>
  );
};

export default AllUsers;