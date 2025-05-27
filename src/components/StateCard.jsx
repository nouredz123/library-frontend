import React from 'react'

export default function StateCard({ title, value, icon, bgColor, isLoading }) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-start space-x-4 border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md">
            <div className={`p-3 rounded-lg ${bgColor}`}>
                {icon}
            </div>
            <div>
                <h3 className="text-[#64748b] font-medium mb-1">{title}</h3>
                <p className="text-2xl font-bold text-[#1e293b]">{isLoading ? '...' : value}</p>
            </div>
        </div>
    )
}
