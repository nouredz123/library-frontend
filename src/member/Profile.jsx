import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoutImg from '../assets/logout.png';
import logo from '../assets/logo.png';
import frame from '../assets/frame 165.png';
import bookNotAvailable from '../assets/book-notAvailable.jpg'
import BookDetailsModal from "../components/BookDetailsModal";
import { FaRegCircleCheck } from "react-icons/fa6";
import { FaCalendar } from "react-icons/fa";
import { PiWarningDiamondBold } from "react-icons/pi";
import { FaHourglassHalf } from "react-icons/fa6";


const apiUrl = import.meta.env.VITE_API_URL;
const Profile = () => {
  const [userInfo, setUserInfo] = useState({});
  const [borrowings, setBorrowings] = useState([]);

  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const navigate = useNavigate();
  useEffect(()=>{
    fetchMemberInfo();
    fetchBorrowings();
  },[])
    
  const fetchMemberInfo = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    const response = await fetch(`${apiUrl}/api/member/${user.id}/info`,{
      method: "GET",
      headers: {
        'Content-type': 'application/json',
        "Authorization": `Bearer ${user?.token || ''}`
      }
    });
    if (!response.ok) {
      const error = await response.text();
      console.error("get info failed:", error);
    } else {
      const data = await response.json();
      setUserInfo(data);
      console.log("successful:", data);
    }

  }
  const fetchBorrowings = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const response = await fetch(`${apiUrl}/api/member/${user?.id}/borrowings`,{
      method: "GET",
      headers: {
        'Content-type': 'application/json',
        "Authorization": `Bearer ${user?.token || ''}`
      }
    });
    if (!response.ok) {
      const error = await response.text();
      console.error("get info failed:", error);
    } else {
      const data = await response.json();
      setBorrowings(data);
      console.log("borrowings:", data);
    }

  }
    
  const logout = ()=> {
    localStorage.removeItem("user");
    navigate("/sign-in",{replace: true});
    console.log('Logging out...');
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function() {
      window.history.pushState(null, "", window.location.href);
    };
  }
  return (
    <div className="flex justify-center w-full bg-[#101624] min-h-screen">
      <div className="w-full max-w-[1440px] bg-[#101624] bg-cover bg-center pb-10" style={{ backgroundImage: 'url(/assets/images/EXPORT-BG.png)' }}>
        {/* Header */}
        <header className="flex items-center justify-between w-[1240px] mx-auto py-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/member/Dashboard')}>
            <div className="w-[60px] h-[56px]">
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <p className="text-2xl font-semibold">
              <span className="text-white">Book</span>
              <span className="text-[#db4402]">FSEI</span>
            </p>
          </div>
          <nav className="flex items-center gap-8">
            <Link to="/member/Dashboard" className="text-[#d5dfff] text-lg font-medium hover:text-[#db4402] transition">Home</Link>
            <Link to="/member/Search" className="text-[#d5dfff] text-lg font-medium hover:text-[#db4402] transition">Search</Link>
            <div className="text-[#db4402] text-lg font-medium">Profile</div>
            <img src={logoutImg} alt="Logout" className="cursor-pointer hover:opacity-80 transition" onClick={logout}/>
          </nav>
        </header>

        {/* Profile Content */}
        <section className="flex justify-between gap-5 max-w-[1160px] mx-auto my-10 p-4">
          {/* Student Info */}
          <div className="flex-[0.5] bg-[#121a2e] p-8 rounded-lg text-[#d5dfff]">
            <div className="flex flex-col items-center gap-2 relative mb-5">
              <img src={frame} alt="Student Icon" className="w-[59px] h-[88px] absolute -top-10" />
              <h2 className="text-2xl text-[#db4402] mt-16">Student Information</h2>
            </div>
            <form className="flex flex-col gap-4">
              <div>
                <label htmlFor="name" className="text-lg">Name:</label>
                <input 
                  type="text" 
                  id="name" 
                  value={userInfo.fullName} 
                  readOnly 
                  className="w-full p-3 text-lg border border-[#d5dfff] rounded-md bg-[#101624] text-white cursor-not-allowed" 
                />
              </div>
              <div>
                <label htmlFor="id" className="text-lg">ID:</label>
                <input 
                  type="text" 
                  id="id" 
                  value={userInfo.identifier} 
                  readOnly 
                  className="w-full p-3 text-lg border border-[#d5dfff] rounded-md bg-[#101624] text-white cursor-not-allowed" 
                />
              </div>
              <div>
                <label htmlFor="email" className="text-lg">Email:</label>
                <input 
                  type="email" 
                  id="email" 
                  value={userInfo.email} 
                  readOnly 
                  className="w-full p-3 text-lg border border-[#d5dfff] rounded-md bg-[#101624] text-white cursor-not-allowed" 
                />
              </div>
            </form>
          </div>
          
          {/* Borrowed Books */}
          <div className="flex-1 p-4 bg-[#121a2e] rounded-lg">
            <h2 className="text-2xl text-white text-center mb-4">Borrowed Books</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {borrowings.length > 0 ? (
                borrowings.map((borrowing, index) => (
                  <div key={index} className="flex gap-2 bg-[#1a2238] rounded-lg p-4 items-center"  onClick={() => handleCardClick(borrowing?.bookCopy?.book)}>
                    <img 
                      src={borrowing?.bookCopy?.book?.coverUrl || '/assets/images/book.png'} 
                      alt="Book Cover" 
                      className="w-20 h-26 rounded object-cover" 
                      onError={(e) => e.target.src = bookNotAvailable} 
                    />
                    <div className="text-[#d5dfff]">
                      <p><strong>Title:</strong> {borrowing?.bookCopy?.book?.title || 'N/A'}</p>
                      <p><strong>By:</strong> {borrowing?.bookCopy?.book?.author || 'Unknown'}</p>
                      <p><strong>Department:</strong> {borrowing?.bookCopy?.book?.department || 'General'}</p>
                      <p><strong>PickUp Date:</strong> {new Date(borrowing?.pickUpDate).toLocaleDateString()}</p>
                      <p><strong>Return Date:</strong> {borrowing?.returnDate ? new Date(borrowing.returnDate).toLocaleDateString() : 'Not returned'}</p>
                      <div className={
                          borrowing.status === "RETURNED"
                          ? "text-[#4caf50]"
                          : borrowing.status === "PICKED_UP"
                          ? borrowing.returnDate && new Date(borrowing.returnDate) < new Date()
                          ? "text-[#f44336]"
                          : "text-[#ffb300]"
                          : borrowing.status === "PENDING"
                          ? "text-amber-300"
                          : "text-white"
                      }>
                        <strong>
                          {borrowing.status === "RETURNED" 
                            ? (<div className="flex items-center gap-2"> <FaRegCircleCheck size={20}/> <p>Returned</p></div>)
                            : borrowing.returnDate && new Date(borrowing.returnDate) < new Date()
                            ? (<div className="flex items-center gap-2"> <PiWarningDiamondBold size={20}/> <p>Overdue Return</p></div>)
                            : borrowing.status === "PICKED_UP"
                            ? (<div className="flex items-center gap-2"> <FaCalendar size={20}/> <p>{Math.ceil(
                              (new Date(borrowing.returnDate) - new Date()) / (1000 * 60 * 60 * 24)
                            )} day(s) left to return</p></div>)
                            : borrowing.status === "PENDING"
                            ? (<div className="flex items-center gap-2"> <FaHourglassHalf size={20}/> <p>Waiting to be picked up</p></div>)
                            : borrowing.status}
                        </strong>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-[#d5dfff]">
                  No books currently borrowed
                </div>
              )}
            </div>
            <BookDetailsModal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
              book={selectedBook} 
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;

