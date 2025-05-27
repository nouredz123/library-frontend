import React from 'react'
import CoverImage from './CoverImage'

export default function BookItem({ book, deleteBook }) {

  return (
    <tr className="hover:bg-[#f8fafc]">
      {/* Book Details */}
      <td className="p-2">
        <div className="flex items-center gap-4">
          <CoverImage coverUrl={book?.coverUrl} title={book.title}/>
          <div>
            <p className="font-medium text-[#1e293b]">{book.title}</p>
            <p className="text-sm text-[#64748b]">{book.author}</p>
          </div>
        </div>
      </td>

      {/* Department */}
      <td className="p-2 text-sm">{book.department}</td>

      {/* Date Added */}
      <td className="p-2 text-sm">{new Date(book?.addedDate).toLocaleDateString()}</td>

      {/* Status */}
      <td className="p-2">
        <span className={`px-4 py-1 rounded-full text-xs font-medium ${
          book.available 
            ? 'bg-[#f0fdf4] text-[#15803d]' 
            : 'bg-[#fff7ed] text-[#c2410c]'
        }`}>
          {book.available ? 'Available' : 'Borrowed'}
        </span>
      </td>

      {/* Actions */}
      <td className="p-2">
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-[#e0f2fe] text-[#0369a1] rounded text-xs font-medium">
            Edit
          </button>
          <button 
            onClick={() => deleteBook(book.id)}
            className="px-4 py-1.5 bg-[#fee2e2] text-[#dc2626] rounded text-xs font-medium"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}
