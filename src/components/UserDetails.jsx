import React from 'react'

export default function UserDetailsModal({user, closeDetailModal, openModal , openImageModal}) {
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
                    <div className="bg-white rounded-2xl p-6 w-[800px] shadow-lg">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-semibold">User Details</h3>
                            <button onClick={closeDetailModal} className="text-[#475569] text-2xl font-semibold hover:text-black">
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
                                            <p className="font-medium">{user.fullName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#64748b]">Email</p>
                                            <p className="font-medium">{user.email}</p>
                                        </div>
                                        {user.role === "ROLE_MEMBER" && (
                                        <div>
                                            <p className="text-xs text-[#64748b]">University ID</p>
                                            <p className="font-medium">{user.identifier}</p>
                                        </div>
                                        )}
                                        {user.dateOfBirth && user.role === "ROLE_MEMBER" && (
                                            <div>
                                                <p className="text-xs text-[#64748b]">Birth info</p>
                                                <p className="font-medium">{formatDate(user.dateOfBirth)}</p>
                                                <p className="font-medium">{user.birthWilaya}</p>
                                            </div>
                                        )}
                                        {user.department && user.role === "ROLE_MEMBER" && (
                                            <div>
                                                <p className="text-xs text-[#64748b]">Department</p>
                                                <p className="font-medium">{user.department}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-xs text-[#64748b]">Join Date</p>
                                            <p className="font-medium">{formatDate(user.joinDate)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#64748b]">Account Status</p>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.accountStatus === "APPROVED"
                                                ? 'bg-[#f0fdf4] text-[#15803d]'
                                                : user.accountStatus === "PENDING"
                                                    ? 'bg-[#fff7ed] text-[#c2410c]'
                                                    : 'bg-[#fee2e2] text-[#dc2626]'
                                                }`}>
                                                {user.accountStatus === "APPROVED"
                                                    ? 'Approved'
                                                    : user.accountStatus === "PENDING"
                                                        ? 'Pending'
                                                        : 'Rejected'}
                                            </span>
                                        </div>

                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={closeDetailModal}
                                        className="px-4 py-2 border border-[#e2e8f0] rounded-lg text-sm hover:bg-gray-50"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => {
                                            closeDetailModal();
                                            openModal(user);
                                        }}
                                        className="px-4 py-2 bg-[#25388c] text-white rounded-lg text-sm hover:bg-[#1e2a6d]"
                                    >
                                        Update Status
                                    </button>
                                </div>
                            </div>

                            {/* Right side - Card image for MEMBER, Staff Admin Display for STAFF */}
                            {user.role === "ROLE_MEMBER" ? (
                                <div className="w-1/2">
                                    <h4 className="text-sm font-medium text-[#64748b] mb-4">University Card</h4>
                                    <div className="border border-[#e2e8f0] rounded-lg p-4 flex justify-center items-center h-64">
                                        <img
                                            src={user.cardBase64 ? `data:${user.cardContentType};base64,${user.cardBase64}` : '/default-card.png'}
                                            alt="User Card"
                                            className="max-w-full max-h-full object-contain"
                                            onClick={() => openImageModal(user.cardBase64 ? `data:${user.cardContentType};base64,${user.cardBase64}` : '/default-card.png')}
                                        />
                                    </div>
                                    <p className="text-xs text-[#64748b] mt-2 text-center">Click on the image to view full size</p>
                                </div>
                            ) : (
                                <div className="w-1/2 flex items-center justify-center">
                                    <div className="text-center p-6 border border-[#e2e8f0] rounded-lg bg-gray-50">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <span className="text-gray-400 text-2xl">👤</span>
                                        </div>
                                        <h4 className="text-lg font-medium text-[#475569] mb-2">Staff Account</h4>
                                        <p className="text-sm text-[#64748b]">Administrator with system management privileges</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
  )
}
