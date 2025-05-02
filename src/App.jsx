import React from 'react';
import SignIn from './auth/sign-in';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./Home";
import Dashboard from './member/Dashboard';
import StaffDashboard from './staff/StaffDashboard';
import Profile from './member/Profile';
import AllUsers from './staff/AllUsers';
import AllBooks from './staff/AllBooks';
import SignUp from './auth/sign-up';
import AccountRequests from './staff/AccountRequests';
import { Toaster } from 'react-hot-toast';
function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/member/Dashboard' element={(<Dashboard />)} />
        <Route path='/member/profile' element={(<Profile />)} />
        <Route path='/staff/Dashboard' element={(<StaffDashboard />)} />
        <Route path='/staff/AllUsers' element={(<AllUsers />)} />
        <Route path='/staff/AllBooks' element={(<AllBooks />)} />
        <Route path='/staff/AccountRequests' element={(<AccountRequests />)} />
      </Routes>
    </Router>
    <Toaster/>
    </>
  );
}

export default App;