import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import home from '../assets/home.png';
import profile from '../assets/profile-2user.png';
import book from '../assets/book.png';
import borrow from '../assets/bookmark-2.png';
import user from '../assets/user.png';
import logoutImg from '../assets/logout.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

export default function AdminSideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    getAdminInfo();
  }, [])

  const getAdminInfo = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const response = await fetch(`${apiUrl}/api/staff/${user.id}/info`, {
        method: "GET",
        headers: {
          'Content-type': 'application/json',
          "Authorization": `Bearer ${user?.token || ''}`
        }
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("Get info failed:", error);
      } else {
        const data = await response.json();
        setUserInfo(data);
        console.log("User info fetch successful:", data);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/sign-in", { replace: true });
    console.log('Logging out...');
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  };


  // Function to check if link is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed top-0 left-0 h-screen w-[288px] bg-white border-r border-[#edf1f1] flex flex-col justify-between p-4">

      {/* Top Section */}
      <div>
        <div className="py-5 flex flex-row gap-1.5 items-center">
          <img src={logo} alt="BookFSEI Logo" className="w-10 h-10" />
          <div className="text-[#25388c] font-semibold text-[26px] leading-6">
            FSEI Library
          </div>
        </div>
        <div className="border-t border-dashed border-[#8c8e98] my-4"></div>

        {/* Menu */}
        <div className="flex flex-col gap-2">
          {/* Home */}
          <Link
            to="/staff/Dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer ${isActive("/staff/Dashboard") ? 'bg-[#25388c]' : 'hover:bg-[#f8fafc]'
              }`}
          >
            <img
              src={home}
              alt="Books Icon"
              className={`w-5 h-5 ${isActive("/staff/home") ? 'filter brightness-0 invert' : ''}`}
            />
            <p className={`text-sm font-medium ${isActive("/staff/Dashboard") ? 'text-white' : 'text-[#475569]'}`}>
              Home
            </p>
          </Link>

          {/* All Users */}
          <Link
            to="/staff/AllUsers"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer ${isActive("/staff/AllUsers") ? 'bg-[#25388c]' : 'hover:bg-[#f8fafc]'
              }`}
          >
            <img
              src={profile}
              alt="Home Icon"
              className={`w-5 h-5 ${isActive("/staff/AllUsers") ? 'filter brightness-0 invert' : ''}`}
            />
            <p className={`text-sm font-medium ${isActive("/staff/AllUsers") ? 'text-white' : 'text-[#475569]'}`}>
              All Users
            </p>
          </Link>

          {/* All Books */}
          <Link
            to="/staff/AllBooks"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer ${isActive("/staff/AllBooks") ? 'bg-[#25388c]' : 'hover:bg-[#f8fafc]'
              }`}
          >
            <img
              src={book}
              alt="Users Icon"
              className={`w-5 h-5 ${isActive("/staff/AllBooks") ? 'filter brightness-0 invert' : ''}`}
            />
            <p className={`text-sm font-medium ${isActive("/staff/AllBooks") ? 'text-white' : 'text-[#475569]'}`}>
              All Books
            </p>
          </Link>

          {/* Borrow Requests */}
          <Link
            to="/staff/borrowrequests"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer ${isActive("/staff/borrowrequests") ? 'bg-[#25388c]' : 'hover:bg-[#f8fafc]'
              }`}
          >
            <img
              src={borrow}
              alt="Borrow Icon"
              className={`w-5 h-5 ${isActive("/staff/borrowrequests") ? 'filter brightness-0 invert' : ''}`}
            />
            <p className={`text-sm font-medium ${isActive("/staff/borrowrequests") ? 'text-white' : 'text-[#475569]'}`}>
              Borrow Requests
            </p>
          </Link>

          {/* Account Requests */}
          <Link
            to="/staff/accountRequests"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer ${isActive("/staff/accountRequests") ? 'bg-[#25388c]' : 'hover:bg-[#f8fafc]'
              }`}
          >
            <img
              src={user}
              alt="Account Icon"
              className={`w-5 h-5 ${isActive("/staff/accountRequests") ? 'filter brightness-0 invert' : ''}`}
            />
            <p className={`text-sm font-medium ${isActive("/staff/accountRequests") ? 'text-white' : 'text-[#475569]'}`}>
              Account Requests
            </p>
          </Link>
        </div>
      </div>

      {/* Bottom Admin Section */}
      <div className="bg-white rounded-[62px] border border-[#edf1f1] px-3 py-2 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-medium text-[#1e293b]">{userInfo.fullName || "admin"}</span>
            <span className="text-xs text-[#64748b]">{userInfo.email || "admin@univ-mosta.dz"}</span>
          </div>
        </div>
        <button onClick={logout} className="p-1">
          <img src={logoutImg} alt="Logout" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
