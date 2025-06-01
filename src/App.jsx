import React from 'react';
import SignIn from './auth/sign-in';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './member/Dashboard';
import StaffDashboard from './staff/StaffDashboard';
import Profile from './member/Profile';
import AllUsers from './staff/AllUsers';
import AllBooks from './staff/AllBooks';
import SignUp from './auth/sign-up';
import SignUpStaff from './auth/sign-up-staff'
import AccountRequests from './staff/AccountRequests';
import { Toaster } from 'react-hot-toast';
import Search from './member/Search';
import BorrowRequests from './staff/BorrowRequests';
function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/sign-up-staff' element={<SignUpStaff />} />
        <Route path='/member/Dashboard' element={(<Dashboard />)} />
        <Route path='/member/profile' element={(<Profile />)} />
        <Route path='/member/Search' element={(<Search />)} />
        <Route path='/staff/Dashboard' element={(<StaffDashboard />)} />
        <Route path='/staff/AllUsers' element={(<AllUsers />)} />
        <Route path='/staff/AllBooks' element={(<AllBooks />)} />
        <Route path='/staff/AccountRequests' element={(<AccountRequests />)} />
        <Route path='/staff/BorrowRequests' element={(<BorrowRequests />)} />
      </Routes>
    </Router>
    <Toaster/>
    </>
  );
}

export default App;