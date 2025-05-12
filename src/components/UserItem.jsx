import React from 'react'

export default function UserItem({ user, onDeleteClick, openDetailModel, openImageModal }) {
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    return (
        <tr className="border-b border-[#e2e8f0] hover:bg-gray-50 cursor-pointer" onClick={openDetailModel}>
            <td className="p-2">
                <div className="flex flex-col gap-1">
                    <span className="font-medium text-[#1e293b]">{user.fullName}</span>
                    <span className="text-sm text-[#64748b]">{user.email}</span>
                </div>
            </td>
            <td className="p-2 text-sm">{user.identifier}</td>
            <td className="p-2">
                <button
                    className={`px-4 py-2 rounded-full text-xs font-medium ${user.role === 'ROLE_STAFF'
                        ? 'bg-[#f0fdf4] text-[#15803d]'
                        : 'bg-[#e0f2fe] text-[#0369a1]'
                        }`}
                >
                    {user.role === 'ROLE_STAFF' ? 'Staff' : 'Member'}
                </button>
            </td>
            <td className="p-2 text-sm">{formatDate(user.joinDate)}</td>
            <td className="p-2">
                <button className="px-4 py-2 bg-[#e0f2fe] text-[#0369a1] rounded text-xs font-medium"
                    onClick={openImageModal}
                >
                    View
                </button>
            </td>
            <td className="p-2">
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            onDeleteClick(user);
                        }}
                        className="px-4 py-2 bg-[#fee2e2] text-[#dc2626] rounded text-xs font-medium"
                    >
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    )
}
