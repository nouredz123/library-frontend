import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import eyeIcon from '../assets/eye.png';
import eyeSlachIcon from '../assets/eye-slash.png';
import backgroundImage from '../assets/image-14.jpg';
import noiseBackground from '../assets/Noise.png';
import exportBg from '../assets/EXPORT-BG.png';
import toast from 'react-hot-toast';

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef(null);

  useEffect(() => {
    document.getElementById('emailInput')?.focus();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token && user?.role === "MEMBER") {
      navigate("/member/Dashboard");
    }
  }, [navigate]);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill in both username and password.");
      return;
    }
    login();
  };

  

  const login = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      const data = await response.json();
      console.log(data);
  

      if (data && data.role =="MEMBER") {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/member/Dashboard");
        toast.success("loged in successfully");
      } else if (data.role =="STAFF") {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/staff/dashboard");
        toast.success("loged in successfully");
      } else {
        console.error("Invalid role or missing token");
      }

    } catch (error) {
      toast.error("Somthing went wrong, please try again later.");
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="relative bg-[rgb(16,22,36)] flex flex-col justify-center w-full bg-cover" style={{ backgroundImage: `url(${exportBg})` }}>
    <div className='absolute inset-0 bg-cover bg-center opacity-25' style={{ backgroundImage: `url(${noiseBackground})`}}></div>
    <div className="w-full grid grid-cols-2 gap-16 z-10 items-start min-h-screen">
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
              Welcome Back to the Book FSEI
            </p>
            <p className="w-full text-[#d5dfff] text-[18px] leading-5 mb-5">
              Access the vast collection of resources, and stay updated.
            </p>
          </div>
        </header>

        <form id="sign-up-form" className="flex flex-col items-start gap-4 w-full" onSubmit={(e)=>{
          e.preventDefault();
          handleLogin();
        }}>
          <div className="flex flex-col items-start gap-5 w-full py-2">

            <div className="flex flex-col items-start gap-2 w-full">
              <label className="w-full text-[#d5dfff] text-base leading-6">Email</label>
              <input
                className="flex items-center justify-center h-[50px] px-3 py-2 w-full bg-[#232839] rounded-[5px] border-none text-white text-base leading-6 outline-none"
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    passwordRef?.current?.focus();
                  }
                }}
                onChange={(e)=>{setFormData(prev => ({...prev, email: e.target.value}))}}
              />
              {/* {errors.email && (
                <span className="text-[#ff4d4d] text-xs mt-1">{"errors.email"}</span>
              )} */}
            </div>

            <div className="flex flex-col items-start gap-2 w-full">
              <label className="w-full text-[#d5dfff] text-base leading-6">Password</label>
              <div className="flex h-[50px] items-center gap-1.5 px-3 py-2 w-full bg-[#232839] rounded-[5px]">
                <input
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  className="bg-transparent border-none outline-none text-white text-base flex-1 transition-all duration-300"
                  name="password"
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={(e)=>{setFormData(prev => ({...prev, password: e.target.value}))}}
                />
                <div className="relative inline-block cursor-pointer" onClick={togglePassword}>
                  <img className="w-5 h-5 hover:scale-110 hover:opacity-80 transition-transform duration-200" src={!showPassword? eyeIcon : eyeSlachIcon} alt="Toggle password" />
                  <span className="invisible opacity-0 w-[120px] bg-[#232839] text-[#d5dfff] text-center rounded-[6px] px-[6px] py-[8px] absolute z-10 bottom-[125%] left-1/2 -translate-x-1/2 text-xs shadow-[0px_0px_10px_#00000033] group-hover:visible group-hover:opacity-100 transition-opacity duration-300">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </div>
              </div>
            </div>

          </div>
        
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-8 py-4 w-full bg-[#db4402] rounded-md min-h-[56px] hover:bg-[#e05206] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] active:scale-98 active:shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
          >
            <span className="text-white text-base leading-6 font-bold whitespace-nowrap">Login</span>
          </button>
          <div className="w-full text-center text-[#d5dfff] text-base leading-6">
            <span className="font-medium">Don't have an account already? </span>
            <span>&nbsp;</span>
            <Link to="/sign-up" className="font-bold text-[#db4402] hover:text-[#ff5c1b] transition-colors duration-300">Register here</Link>
          </div>
        </form>
      </div>
      <img src={backgroundImage} className="w-full object-cover" loading='lazy' alt="Background"/>
    </div>
  </div>
  );
}