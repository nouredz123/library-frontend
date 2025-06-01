import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import eyeIcon from '../assets/eye.png';
import eyeSlachIcon from '../assets/eye-slash.png';
import backgroundImage from '../assets/image-14.jpg';
import noiseBackground from '../assets/Noise.png';
import exportBg from '../assets/EXPORT-BG.png';
import toast from 'react-hot-toast';

const apiUrl = import.meta.env.VITE_API_URL;

export default function SignIn() {
  const navigate = useNavigate();
  //state to store form data
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    document.getElementById('email')?.focus();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token && user?.role === "MEMBER") {
      navigate("/member/Dashboard");
    }
  }, [navigate]);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      email: "",
      password: ""
    };

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields.");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;
    login();
  };


  const login = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error) {
          toast.error(data.error);
          return;
        }else{
          throw new Error(data.error);
        }
      }

      if (data && data.role == "MEMBER") {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/member/Dashboard");
        toast.success("loged in successfully");
      } else if (data.role == "STAFF") {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/staff/Dashboard");
        toast.success("loged in successfully");
      } else {
        console.error("Invalid role or missing token");
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="relative bg-[rgb(16,22,36)] flex flex-col justify-center w-full bg-cover" style={{ backgroundImage: `url(${exportBg})` }}>

      <div className='absolute inset-0 bg-cover bg-center opacity-25' style={{ backgroundImage: `url(${noiseBackground})` }}></div>
      
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16 z-10 items-start min-h-screen">
        <div className="flex flex-col  mx-auto lg:ml-16 my-24 px-8 py-10 rounded-3xl items-start shadow-[0px_0px_70px_0px_rgba(0,0,0,0.2)] bg-gradient-to-b from-[#12141d] to-[#12151f]">
          <header className="flex flex-col items-start gap-4 w-full">
            <div className="inline-flex items-center gap-2">
              <img className="w-16 h-16" src={logo} alt="Logo" />
              <p className="text-3xl leading-6 font-semibold">
                <span className="text-white">FSEI</span>
                <span className="text-[#db4402]"> Library</span>
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 w-full">
              <p className="w-full text-3xl leading-[30px] font-semibold text-white">
                Welcome Back to the FSEI Library
              </p>
              <p className="w-full text-[#d5dfff] text-[18px] leading-5 mb-5">
                Access the vast collection of resources, and stay updated.
              </p>
            </div>
          </header>

          <form id="sign-up-form" className="flex flex-col items-start gap-4 w-full">
            <div className="flex flex-col items-start gap-5 w-full py-2">

              <div className="flex flex-col items-start gap-2 w-full">
                <label className="w-full text-[#d5dfff] text-base leading-6">Email <span className="text-red-500">*</span></label>
                <input
                  className="flex items-center justify-center h-[50px] px-3 py-2 w-full bg-[#232839] rounded-[5px] border-none text-white text-base leading-6 outline-none focus:outline-[#ff5c1b] "
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      document.getElementById("password").focus();
                    }
                  }}
                  onChange={(e) => { setFormData(prev => ({ ...prev, email: e.target.value })) }}
                />
                {errors.email && (
                  <span className="text-[#ff4d4d] text-xs mt-1">{errors.email}</span>
                )}
              </div>

              <div className="flex flex-col items-start gap-2 w-full">
                <label className="w-full text-[#d5dfff] text-base leading-6">Password  <span className="text-red-500">*</span></label>
                <div className="flex h-[50px] items-center gap-1.5 px-3 py-2 w-full bg-[#232839] rounded-[5px] focus-within:outline focus-within:outline-[#ff5c1b] ">
                  <input
                    id='password'
                    type={showPassword ? "text" : "password"}
                    className="bg-transparent border-none outline-none text-white text-base flex-1 transition-all duration-300"
                    name="password"
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleLogin(e);
                      }
                    }}
                    onChange={(e) => { setFormData(prev => ({ ...prev, password: e.target.value })) }}
                  />
                  <div className="relative inline-block cursor-pointer" onClick={togglePassword}>
                    <img className="w-5 h-5 hover:scale-110 hover:opacity-80 transition-transform duration-200" src={!showPassword ? eyeIcon : eyeSlachIcon} alt="Toggle password" />
                    <span className="invisible opacity-0 w-[120px] bg-[#232839] text-[#d5dfff] text-center rounded-[6px] px-[6px] py-[8px] absolute z-10 bottom-[125%] left-1/2 -translate-x-1/2 text-xs shadow-[0px_0px_10px_#00000033] group-hover:visible group-hover:opacity-100 transition-opacity duration-300">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </div>
                </div>
                {errors.password && (
                  <span className="text-[#ff4d4d] text-xs mt-1">{errors.password}</span>
                )}
              </div>

            </div>

            <button
              type="button"
              onClick={handleLogin}
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
        <img src={backgroundImage} className="w-full object-cover  hidden lg:block" loading='lazy' alt="Background" />
      </div>
    </div>
  );
}