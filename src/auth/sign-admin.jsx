import React, { useState } from 'react';
import logo from '../assets/logo.png';
import eyeIcon from '../assets/eye.png';
import eyeSlachIcon from '../assets/eye-slash.png';
import backgroundImage from '../assets/image-14.jpg';
import noiseBackground from '../assets/Noise.png';
import exportBg from '../assets/EXPORT-BG.png';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SignAdmin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    adminCode: "",
  });

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.fullName || !formData.adminCode) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/register-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          adminCode: formData.adminCode,
          role: "STAFF"
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      toast.success("Admin registration successful!");
      navigate("/sign-in");
      
    } catch (error) {
      toast.error(error.message || "Registration failed");
      console.error("Error:", error);
    }
  };

  return (
    <div className="relative bg-[rgb(16,22,36)] flex flex-col justify-center w-full bg-cover" style={{ backgroundImage: `url(${exportBg})` }}>
      <div className='absolute inset-0 bg-cover bg-center opacity-25' style={{ backgroundImage: `url(${noiseBackground})`}}></div>
      <div className="w-full grid grid-cols-2 gap-16 z-10">
        <div className="flex flex-col ml-16 my-24 px-8 py-10 rounded-3xl items-start shadow-[0px_0px_70px_0px_rgba(0,0,0,0.2)] bg-gradient-to-b from-[#12141d] to-[#12151f]">
          <header className="flex flex-col items-start gap-4 w-full">
            <div className="inline-flex items-center gap-2">
              <img className="w-16 h-16" src={logo} alt="Logo" />
              <p className="text-3xl leading-6 font-semibold">
                <span className="text-white">Book</span>
                <span className="text-[#db4402]"> FSEI</span>
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 w-full">
              <p className="w-full text-3xl leading-[30px] font-semibold text-white">
                Admin Registration
              </p>
              <p className="w-full text-[#d5dfff] text-[18px] leading-5 mb-5">
                Create an admin account to manage the library system.
              </p>
            </div>
          </header>

          <form className="flex flex-col items-start gap-4 w-full" onSubmit={handleSignUp}>
            <div className="flex flex-col items-start gap-5 w-full py-2">
              
              <div className="flex flex-col items-start gap-2 w-full">
                <label className="w-full text-[#d5dfff] text-base leading-6">Full Name</label>
                <input
                  className="flex items-center justify-center h-[50px] px-3 py-2 w-full bg-[#232839] rounded-[5px] border-none text-white text-base leading-6 outline-none"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({...prev, fullName: e.target.value}))}
                />
              </div>

              <div className="flex flex-col items-start gap-2 w-full">
                <label className="w-full text-[#d5dfff] text-base leading-6">Email</label>
                <input
                  className="flex items-center justify-center h-[50px] px-3 py-2 w-full bg-[#232839] rounded-[5px] border-none text-white text-base leading-6 outline-none"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                />
              </div>

              <div className="flex flex-col items-start gap-2 w-full">
                <label className="w-full text-[#d5dfff] text-base leading-6">Admin Code</label>
                <input
                  className="flex items-center justify-center h-[50px] px-3 py-2 w-full bg-[#232839] rounded-[5px] border-none text-white text-base leading-6 outline-none"
                  type="password"
                  placeholder="Enter admin code"
                  value={formData.adminCode}
                  onChange={(e) => setFormData(prev => ({...prev, adminCode: e.target.value}))}
                />
              </div>

              <div className="flex flex-col items-start gap-2 w-full">
                <label className="w-full text-[#d5dfff] text-base leading-6">Password</label>
                <div className="flex h-[50px] items-center gap-1.5 px-3 py-2 w-full bg-[#232839] rounded-[5px]">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="bg-transparent border-none outline-none text-white text-base flex-1 transition-all duration-300"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
                  />
                  <div className="relative inline-block cursor-pointer" onClick={togglePassword}>
                    <img 
                      className="w-5 h-5 hover:scale-110 hover:opacity-80 transition-transform duration-200" 
                      src={!showPassword ? eyeIcon : eyeSlachIcon} 
                      alt="Toggle password" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-8 py-4 w-full bg-[#db4402] rounded-md min-h-[56px] hover:bg-[#e05206] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] active:scale-98 active:shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
            >
              <span className="text-white text-base leading-6 font-bold whitespace-nowrap">Register as Admin</span>
            </button>

            <div className="w-full text-center text-[#d5dfff] text-base leading-6">
              <span className="font-medium">Already have an account?</span>
              <span>&nbsp;</span>
              <Link to="/sign-in" className="font-bold text-[#db4402] hover:text-[#ff5c1b] transition-colors duration-300">Login</Link>
            </div>
          </form>
        </div>
        <div 
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        ></div>
      </div>
    </div>
  );
};

export default SignAdmin;