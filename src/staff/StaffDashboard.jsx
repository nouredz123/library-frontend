import { ArrowLeft, Book, ChevronLeft, ChevronRight } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { departments } from '../constants';
import logo from '../assets/logo.png';
import home from '../assets/home.png';
import profile from '../assets/profile-2user.png';
import book from '../assets/book.png';
import borrow from '../assets/bookmark-2.png';
import user from '../assets/user.png';
import logoutImg from '../assets/logout.png';
import plusBook from '../assets/Plusbook.png';
export default function StaffDashboard() {
  // State for selected department and books
  const [insights, setInsights] = useState({});
   const navigate = useNavigate();
   useEffect(()=>{
    fetchInsights();
   },[]);

  const fetchInsights = async() => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await fetch(`http://localhost:8080/api/staff/insights`, {
        method: "GET",
        headers: {
          'Content-type': 'application/json',
          "Authorization": `Bearer ${user?.token || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch  insights`);
      }
      
      const data = await response.json();
      console.log(data);
      setInsights(data);
      
    } catch (error) {
      console.log(`Error fetching insights:`, error);
      
    }
  }

  const viewAll = (type) => {
    switch(type) {
      case 'borrow':
        navigate('/admin/booksreq/borrow-requests');
        break;
      case 'books':
        navigate('/admin/allbooks/all-books');
        break;
      case 'accounts':
        navigate('/admin/accountsreq/account-requests');
        break;
      default:
        break;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/sign-in",{replace: true});
    console.log('Logging out...');
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function() {
      window.history.pushState(null, "", window.location.href);
    };
  };



  return (
    <div className="bg-[#f8f8ff] rounded-2xl relative min-h-screen overflow-y-auto">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-[288px] bg-white border-r border-[#edf1f1] flex flex-col justify-between p-4">
        {/* Top Section */}
        <div>
          <div className="py-5 flex flex-row gap-1.5 items-center">
            <img src={logo} alt="BookFSEI Logo" className="w-10 h-10" />
            <div className="text-[#25388c] font-semibold text-[26px] leading-6">
              BookFSEI
            </div>
        </div>
        <div className="border-t border-dashed border-[#8c8e98] my-4"></div>
  
        {/* Menu */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#25388c] cursor-pointer">
            <img src={home} alt="Books Icon" className="w-5 h-5 filter brightness-0 invert" />
            <p className="text-white text-sm font-medium">Home</p>
          </div>
          <Link to="/staff/AllUsers" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#f8fafc] cursor-pointer">
            <img src={profile} alt="Home Icon" className="w-5 h-5" />
            <p className="text-[#475569] text-sm font-medium">All Users</p>
          </Link>
          
          <Link to="/staff/AllBooks" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#f8fafc] cursor-pointer">
            <img src={book} alt="Users Icon" className="w-5 h-5" />
            <p className="text-[#475569] text-sm font-medium">All Books</p>
          </Link>
          
          <Link to="/staff/borrowrequests" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#f8fafc] cursor-pointer">
            <img src={borrow} alt="Borrow Icon" className="w-5 h-5" />
            <p className="text-[#475569] text-sm font-medium">Borrow Requests</p>
          </Link>
          <Link to="/staff/accountRequests" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#f8fafc] cursor-pointer">
            <img src={user} alt="Account Icon" className="w-5 h-5" />
            <p className="text-[#475569] text-sm font-medium">Account Requests</p>
          </Link>
        </div>
      </div>
  
      {/* Bottom Admin Section */}
      <div className="bg-white rounded-[62px] border border-[#edf1f1] px-3 py-2 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-medium text-[#1e293b]">{user.fullname}</span>
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
        <h1 className="text-2xl font-semibold text-[#1e293b] mb-1">Welcome, Admin</h1>
        <p className="text-[#64748b] text-sm">Monitor all of your projects and tasks here</p>
      </div>
    </div>
    <div className='ml-[288px]'>
      {/* Stats Cards */}
      <div className=" flex flex-row gap-4 items-center justify-start mx-10 my-5 ">
        <div className="bg-white rounded-xl border border-[#edf1f1] p-4 flex flex-col gap-5 items-start justify-start flex-1 relative">
          <div className="flex flex-row gap-2.5 items-start justify-start">
            <div className="text-[#64748b] text-left font-medium text-base truncate">Pending Account Requests</div>
          </div>
          <div className="text-[#1e293b] text-left font-semibold text-[28px] leading-8">{insights.pendingAccountRequests}</div>
        </div>

        <div className="bg-white rounded-xl border border-[#edf1f1] p-4 flex flex-col gap-5 items-start justify-start flex-1 relative">
          <div className="flex flex-row gap-2.5 items-start justify-start">
            <div className="text-[#64748b] text-left font-medium text-base truncate">Active Borrowings {"(Not returned)"}</div>
          </div>
          <div className="text-[#1e293b] text-left font-semibold text-[28px] leading-8">{insights.activeBorrowings}</div>
        </div>

        

        <div className="bg-white rounded-xl border border-[#edf1f1] p-4 flex flex-col gap-5 items-start justify-start flex-1 relative">
          <div className="flex flex-row gap-2.5 items-start justify-start">
            <div className="text-[#64748b] text-left font-medium text-base truncate">Available Books</div>
          </div>
          <div className="text-[#1e293b] text-left font-semibold text-[28px] leading-8">{insights.availableBooks}</div>
        </div>

        <div className="bg-white rounded-xl border border-[#edf1f1] p-4 flex flex-col gap-5 items-start justify-start flex-1 relative">
          <div className="flex flex-row gap-2.5 items-start justify-start">
            <div className="text-[#64748b] text-left font-medium text-base truncate">Active Users {"(Last 30days)"}</div>
          </div>
          <div className="text-[#1e293b] text-left font-semibold text-[28px] leading-8">{insights.activeUsers}</div>
        </div>
      </div>

      {/* Borrow Requests */}
      <div className="bg-white rounded-2xl p-4 flex flex-col gap-3.5 items-start justify-start mx-10 my-5 ">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="text-[#1e293b] text-left font-semibold text-xl leading-[26px]">Borrow Requests</div>
          <div className="bg-[#f8f8ff] rounded-md px-3 py-2 flex flex-row gap-1 items-center justify-center h-9">
            <div className="text-[#25388c] text-left font-semibold text-sm cursor-pointer" onClick={() => viewAll('borrow')}>View all</div>
          </div>
        </div>
        <div className="bg-gradient-to-b from-transparent to-white w-[540px] h-[70px] absolute left-1/2 -translate-x-1/2 bottom-0"></div>
        <div className="w-[508px] h-[252px] relative overflow-hidden">
          <div className="flex flex-col gap-1.5 items-center justify-start absolute left-1/2 -translate-x-1/2 bottom-0">
            <div className="text-[#1e293b] text-left font-semibold text-base leading-[130%]">No Pending Book Requests</div>
            <div className="text-[#64748b] text-left font-normal text-sm leading-[180%] truncate">
              There are no borrow book requests awaiting your review at this time.
            </div>
          </div>
          <div className="w-[193px] h-[144px] absolute left-1/2 -translate-x-1/2 top-9">
            <div className="bg-[#f8fbff] rounded-full w-[144px] h-[144px] absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2"></div>
            <div className="bg-white rounded-md border border-[#f8fbff] border-opacity-50 w-[158px] h-[68px] absolute left-1/2 -translate-x-1/2 top-[38px] shadow-xs"></div>
            <div className="w-[66px] h-[90px] relative">
              <div className="bg-white rounded-lg border border-[#f8fbff] border-opacity-50 w-[66px] h-[90px] absolute left-[calc(50%-68.5px)] top-[27px] shadow-lg"></div>
              <div className="bg-[#eaf2ff] rounded-md border border-[#f8fbff] w-[54px] h-[54px] absolute left-[calc(50%-62.5px)] top-[33px]"></div>
              <div className="flex flex-col gap-1 items-center justify-start w-[54px] absolute left-[34px] top-[93px]">
                <div className="bg-[#e2ecff] rounded-md w-full h-1.5"></div>
                <div className="bg-[#eaf2ff] rounded-md border border-[#f8fbff] w-[39px] h-1.5"></div>
              </div>
            </div>
            <div className="w-[66px] h-[90px] relative">
              <div className="bg-white rounded-lg border border-[#f8fbff] border-opacity-50 w-[66px] h-[90px] absolute left-[calc(50%-1.5px)] top-[27px] shadow-lg"></div>
              <div className="bg-[#eaf2ff] rounded-md border border-[#f8fbff] w-[54px] h-[54px] absolute left-[calc(50%+7.5px)] top-[33px]"></div>
              <div className="flex flex-col gap-1 items-center justify-start w-[54px] absolute left-[104px] top-[93px]">
                <div className="bg-[#e2ecff] rounded-md w-full h-1.5"></div>
                <div className="bg-[#eaf2ff] rounded-md border border-[#f8fbff] w-[39px] h-1.5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Added Books */}
      <div className="bg-white rounded-2xl p-4 flex flex-col gap-3.5 items-start justify-start w-[450px] h-[670px] absolute left-[800px] top-[240px] overflow-hidden">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="text-[#1e293b] text-left font-semibold text-xl leading-[26px]">Recently Added Books</div>
          <div className="bg-[#f8f8ff] rounded-md px-3 py-2 flex flex-row gap-1 items-center justify-center h-9">
            <div className="text-[#25388c] text-left font-semibold text-sm cursor-pointer" onClick={() => viewAll('books')}>View all</div>
          </div>
        </div>
        <div className="flex flex-col gap-[30px] items-start justify-start w-full h-[680px] relative overflow-hidden">
          <div className="flex flex-row gap-2.5 items-start justify-start w-full relative">
            <div className="bg-[#f8f8ff] rounded-[10px] border border-[#f8f8ff] px-4 py-3.5 flex flex-row gap-3.5 items-center justify-start flex-1 shadow-xs">
              <div className="bg-white rounded-full border border-dashed border-white p-3 flex flex-row gap-2 items-start justify-start overflow-hidden">
                <img src="plus0.svg" alt="Plus" className="w-6 h-6" />
              </div>
              <div className="text-[#1e293b] text-left font-medium text-lg tracking-tight">Add New Book</div>
            </div>
          </div>
          <div className="flex flex-col gap-[30px] items-start justify-start w-full overflow-hidden">
            {/* Book Cards */}
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="flex flex-row gap-3 items-center justify-start w-full">
                <img 
                  src={`../../asssets/images/rectangle-24904${item-1}.png`} 
                  alt="Book Cover" 
                  className="w-[48.3px] h-[66.27px] object-cover" 
                />
                <div className="flex flex-col justify-between h-[76px] flex-1">
                  <div className="flex flex-col gap-0.5 items-start justify-start w-full">
                    <div className="text-[#1e293b] text-left font-semibold text-base leading-[130%] truncate">
                      {item % 3 === 0 ? "Jayne Castle - People in Glass Houses" : 
                       item % 2 === 0 ? "Inside Evil: Inside Evil Series, Book 1" : 
                       "The Great Reclamation: A Novel by Rachel Heng"}
                    </div>
                    <div className="flex flex-row gap-2 items-center justify-start">
                      <div className="text-[#64748b] text-left font-normal text-sm leading-[180%]">By Rachel Heng</div>
                      <div className="bg-[#8c8e98] rounded-full w-1 h-1"></div>
                      <div className="text-[#64748b] text-left font-normal text-sm leading-[14px]">Strategic, Fantasy</div>
                    </div>
                  </div>
                  <div className="flex flex-row gap-0.5 items-center justify-start">
                    <div className="w-4 h-4 relative">
                      <img src={`vuesax-linear-calendar${item*2-1}.svg`} alt="Calendar" className="absolute left-0 top-0" />
                    </div>
                    <div className="text-[#3a354e] text-left font-normal text-xs leading-[180%]">12/01/24</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-b from-transparent to-white w-full h-[70px] absolute left-1/2 -translate-x-1/2 bottom-0"></div>
      </div>

      {/* Account Requests */}
      <div className="bg-white rounded-2xl p-4 flex flex-col gap-3.5 items-start justify-start w-[470px] h-[350px] absolute left-[310px] top-[560px] overflow-hidden">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="text-[#1e293b] text-left font-semibold text-xl leading-[26px]">Account Requests</div>
          <div className="bg-[#f8f8ff] rounded-md px-3 py-2 flex flex-row gap-1 items-center justify-center h-9">
            <div className="text-[#25388c] text-left font-semibold text-sm cursor-pointer" onClick={() => viewAll('accounts')}>View all</div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 items-center justify-start absolute left-1/2 -translate-x-1/2 bottom-[18px]">
          <div className="text-[#1e293b] text-left font-semibold text-base leading-[130%]">No Pending Account Requests</div>
          <div className="text-[#64748b] text-left font-normal text-sm leading-[180%] truncate">
            There are currently no account requests awaiting approval.
          </div>
        </div>
        <div className="w-[193px] h-[144px] absolute left-1/2 -translate-x-1/2 top-[18px]">
          <div className="bg-[#eaf2ff] rounded-full border border-[#f8fbff] w-[144px] h-[144px] absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2"></div>
          <div className="bg-white rounded-md border border-[#f8fbff] border-opacity-50 w-[155px] h-[94px] absolute left-1/2 -translate-x-1/2 top-[25px] shadow-xs"></div>
          <div className="bg-white rounded-lg border border-[#f8fbff] border-opacity-50 w-[193px] h-[66px] absolute left-1/2 -translate-x-1/2 top-[39px] shadow-lg"></div>
          <div className="bg-[#eaf2ff] rounded-md border border-[#f8fbff] w-[54px] h-[54px] absolute left-[calc(50%-90.5px)] top-[45px]"></div>
          <div className="flex flex-col gap-3 items-start justify-start absolute left-[70px] top-[51px]">
            <div className="bg-[#e2ecff] rounded-md w-[101px] h-2"></div>
            <div className="flex flex-col gap-1.5 items-start justify-start">
              <div className="bg-[#eaf2ff] rounded-md border border-[#f8fbff] w-[114px] h-2"></div>
              <div className="bg-[#eaf2ff] rounded-md border border-[#f8fbff] w-[87px] h-2"></div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-b from-transparent to-white w-full h-[70px] absolute left-1/2 -translate-x-1/2 bottom-0"></div>
      </div>
    </div>
  </div>
  );
}