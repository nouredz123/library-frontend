import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ChevronDown, ChevronUp, Filter, Search } from 'lucide-react';
import AdminSideBar from '../components/AdminSideBar';
import Pagination from '../components/Pagination'
import UserDetailsModal from '../components/UserDetails';

const apiUrl = import.meta.env.VITE_API_URL;
export default function AccountRequests() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('pending');
    const [currentPage, setCurrentPage] = useState(0);
    const [modalUser, setModalUser] = useState(null);
    const [requests, setRequests] = useState([]);
    const [totalRequests, setTotalRequests] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [newStatus, setNewStatus] = useState("approved");
    const [selectedImage, setSelectedImage] = useState(null);
    const [detailModal, setDetailModal] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ field: 'joinDate', direction: 'desc' });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [shouldSearch, setShouldSearch] = useState(false);


    const location = useLocation();

    useEffect(() => {
        if (location.state?.selectedRequest) {
            setDetailModal(location.state.selectedRequest);
        }
    }, [location.state]);


    const openModal = (user) => {
        setNewStatus("approved");
        setModalUser(user);
    };

    const closeModal = () => setModalUser(null);

    const openDetailModal = (user) => setDetailModal(user);
    const closeDetailModal = () => setDetailModal(null);


    // Sort 
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
    }, [selectedStatus, sortConfig]);


    useEffect(() => {
        setShouldSearch(true);
    }, [currentPage]);


    useEffect(() => {
        if (shouldSearch) {
            fetchAccountRequests();
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

    const fetchAccountRequests = async () => {
        setIsLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));
        let sortBy = sortConfig.field;
        let direction = sortConfig.direction;

        const params = new URLSearchParams();
        if (selectedStatus !== "all") params.append("status", selectedStatus);
        if (searchQuery) params.append("keyword", searchQuery);
        params.append("page", currentPage);
        params.append("sortBy", sortBy);
        params.append("direction", direction);

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
                    setTotalPages(0);
                    setTotalRequests(0);
                    toast.error(data.error);
                    return;
                }
                throw new Error(`Failed to fetch requests`);
            }

            console.log(data);
            setRequests(data.content);
            setTotalPages(data.totalPages);
            setTotalRequests(data.totalElements);

        } catch (error) {
            console.log(`Error fetching requests:`, error);
            toast.error("Failed to load account requests");
        } finally {
            setIsLoading(false);
        }
    }

    // changeAccountApprovalStatus 
    const changeAccountApprovalStatus = async (userId) => {
        const user = JSON.parse(localStorage.getItem("user"));
        console.log(user);

        const params = new URLSearchParams();
        params.append("status", newStatus);
        try {
            const response = await fetch(`${apiUrl}/api/staff/changeAccountApprovalStatus/${userId}?${params.toString()}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${user?.token || ''}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                if (data.error) {
                    console.log(data.error);
                    toast.error(data.error || "Failed to changing Account Approval Status");
                    return;
                }
                throw new Error(`Failed to change Account Approval Status account`);
            }
            console.log(data);
            fetchAccountRequests(selectedStatus);
            closeModal();
            toast.success(`Account ${newStatus === "approved" ? "approved" : "rejected"} successfully.`);
        } catch (error) {
            console.log(`Error changing Account Approval Status:`, error);
            toast.error("An error occurred while processing your request");
        }
    }

    // Format date to be more readable
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Image modal handlers
    const openImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className="bg-[#f8f8ff] rounded-2xl relative min-h-screen overflow-y-auto">
            <AdminSideBar />
            {/* Main Content */}
            <div className="ml-[288px] px-10 py-5">
                <div className="flex flex-row items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#1e293b] mb-1">Account Requests</h1>
                        <p className="text-[#64748b] text-sm">Manage user account approval requests</p>
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
                                <label className="block text-sm font-medium text-[#475569] mb-1">Status</label>
                                <select
                                    className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm w-[150px]"
                                    value={selectedStatus}
                                    onChange={(e) => { setSelectedStatus(e.target.value); }}
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
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
                                        setSelectedStatus('all');
                                        setSortConfig({ field: 'joinDate', direction: 'desc' });
                                        setCurrentPage(0);
                                        // Trigger a new search with default values
                                        setTimeout(() => fetchAccountRequests('all', 'all'), 0);
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
                            <h2 className="text-xl font-semibold">Account Requests</h2>
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
                                        <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">
                                            <button
                                                onClick={() => handleSort('fullName')}
                                                className="flex items-center gap-1 hover:text-[#25388c]"
                                            >
                                                Member Details
                                                {sortConfig.field === 'fullName' &&
                                                    (sortConfig.direction === 'asc' ?
                                                        <ChevronUp className="h-4 w-4" /> :
                                                        <ChevronDown className="h-4 w-4" />)
                                                }
                                            </button>
                                        </th>
                                        <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">ID / Code</th>
                                        <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">
                                            <button
                                                onClick={() => handleSort('joinDate')}
                                                className="flex items-center gap-1 hover:text-[#25388c]"
                                            >
                                                Join Date
                                                {sortConfig.field === 'joinDate' &&
                                                    (sortConfig.direction === 'asc' ?
                                                        <ChevronUp className="h-4 w-4" /> :
                                                        <ChevronDown className="h-4 w-4" />)
                                                }
                                            </button>
                                        </th>
                                        <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">Verification</th>
                                        <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">Status</th>
                                        <th className="px-4 py-4 text-left text-sm text-[#64748b] font-medium whitespace-nowrap">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(requests) && requests.length > 0 ? (
                                        requests.map((req) => (
                                            <tr key={req.id} className="border-b border-[#e2e8f0] hover:bg-gray-50 cursor-pointer" onClick={() => openDetailModal(req)}>
                                                <td className="px-4 py-4">
                                                    <p className="font-medium text-[#1e293b]">{req.fullName}</p>
                                                    <p className="text-[#64748b] text-sm">{req.email}</p>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-[#475569]">
                                                    {req.identifier}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-[#475569]">{formatDate(req.joinDate)}</td>
                                                <td className="px-2 py-2 text-sm text-[#475569]">
                                                    {req.cardBase64 ? (
                                                        <img
                                                            src={`data:${req.cardContentType};base64,${req.cardBase64}`}
                                                            alt="University Card"
                                                            className="w-20 h-12 object-cover rounded-md"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openImageModal(`data:${req.cardContentType};base64,${req.cardBase64}`);
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="text-xs font-medium bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                                            No Card
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-[#475569]">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${req.accountStatus === "APPROVED"
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
                                                    <button onClick={(e) => {
                                                        e.stopPropagation();
                                                        openDetailModal(req);
                                                    }} className="px-3 py-1.5 bg-[#25388c] text-white rounded-lg text-xs font-medium hover:bg-[#1e2a6d] transition">
                                                        Review
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-4 py-8 text-center text-[#64748b]">
                                                {searchQuery || selectedStatus !== 'all'
                                                    ? "No matching requests found"
                                                    : "No account requests available"}
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
                                className="w-full h-auto object-contain rounded-md"
                            />
                        </div>
                    </div>
                </div>
            )}



            {/* Review Modal */}
            {modalUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
                    <div className="bg-white rounded-2xl p-6 w-[500px] shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Update Account Status</h3>
                        <div className="mb-5">
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-medium text-[#1e293b]">{modalUser.fullName}</p>
                            </div>
                            <p className="text-[#64748b] text-sm">{modalUser.email}</p>

                            <div className="mt-3 space-y-1 text-sm text-[#475569]">
                                <p>University ID: {modalUser.identifier}</p>
                                {modalUser.department && <p>Department: {modalUser.department}</p>}
                                {modalUser.birthWilaya && <p>Wilaya: {modalUser.birthWilaya}</p>}
                                {modalUser.dateOfBirth && <p>Birth Date: {formatDate(modalUser.dateOfBirth)}</p>}
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-medium text-[#475569] mb-2">Set Status</label>
                            <select
                                className="w-full border border-[#e2e8f0] rounded-lg text-sm px-4 py-2 focus:border-[#25388c] focus:ring-1 focus:ring-[#25388c]"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                            >
                                <option value="approved">Approve</option>
                                <option value="rejected">Reject</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 border border-[#e2e8f0] rounded-lg text-sm hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => changeAccountApprovalStatus(modalUser.id)}
                                className="px-4 py-2 bg-[#25388c] text-white rounded-lg text-sm hover:bg-[#1e2a6d]"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {detailModal && (
                <UserDetailsModal user={detailModal} closeDetailModal={closeDetailModal} openModal={openModal} openImageModal={openImageModal} />
            )}
        </div>
    );
}