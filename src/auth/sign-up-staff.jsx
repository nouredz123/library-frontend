import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import eyeIcon from '../assets/eye.png';
import eyeSlachIcon from '../assets/eye-slash.png';
import backgroundImage from '../assets/image-14.jpg';
import noiseBackground from '../assets/Noise.png';
import exportBg from '../assets/EXPORT-BG.png';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const apiUrl = import.meta.env.VITE_API_URL;

const SignUpStaff = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    adminCode: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });
  useEffect(() => {
    document.getElementById("fullName")?.focus();
  }, [])

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  const toggleAdminCode = () => {
    setShowAdminCode(!showAdminCode);
  };

  const validateForm = () => {
    let valid = true;
    // Validate required fields
    if (!formData.email || !formData.password || !formData.fullName || !formData.adminCode) {
      toast.error("Please fill in all required fields.");
      valid = false;
    }
    return valid;
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;
    signUp();
  }

  const signUp = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/register-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          adminCode: formData.adminCode,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      const data = await response.json();
      if (data.role == "STAFF") {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/staff/dashboard");
        toast.success("loged in successfully");
      } else {
        console.error("Invalid role or missing token");
      }

    } catch (error) {
      toast.error(error.message || "Registration failed");
      console.error("Error:", error);
    }
  };
   const isEmailValid = async () => {
    setErrors(prev => ({ ...prev, email: "" }));
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: "Email is required" }));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: "Invalid email format." }));
      return false;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await fetch(`${apiUrl}/api/auth/validate/email?email=${encodeURIComponent(formData.email)}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${user?.token || ''}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data === true) {
          setErrors(prev => ({ ...prev, email: "" }));
          return true;
        } else {
          setErrors(prev => ({ ...prev, email: "email already exists." }));
          return false;
        }
      } else {
        setErrors(prev => ({ ...prev, email: "Something went wrong." }));
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return (
    <div className="relative bg-[rgb(16,22,36)] flex flex-col justify-center w-full bg-cover" style={{ backgroundImage: `url(${exportBg})` }}>
      <div className='absolute inset-0 bg-cover bg-center opacity-25' style={{ backgroundImage: `url(${noiseBackground})` }}></div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16 z-10">
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
                Staff Registration
              </p>
              <p className="w-full text-[#d5dfff] text-[18px] leading-5 mb-5">
                Create a staff account to manage the library system.
              </p>
            </div>
          </header>

          <form className="flex flex-col items-start gap-4 w-full">
            <div className="flex flex-col items-start gap-5 w-full py-2">

              <div className="flex flex-col items-start gap-2 w-full">
                <label className="w-full text-[#d5dfff] text-base leading-6">Full Name <span className="text-red-500">*</span></label>
                <input
                  id='fullName'
                  className="flex items-center justify-center h-[50px] px-3 py-2 w-full bg-[#232839] rounded-[5px] border-none text-white text-base leading-6 outline-none focus:outline-[#ff5c1b] "
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setErrors(prev => ({ ...prev, fullName: "" }));
                      if (!formData.fullName) {
                        setErrors(prev => ({ ...prev, fullName: "Full name is required." }));
                        return;
                      }
                      e.preventDefault();
                      document.getElementById("email")?.focus();
                    }
                  }}
                />
              </div>

              <div className="flex flex-col items-start gap-2 w-full">
                <label className="w-full text-[#d5dfff] text-base leading-6">Email <span className="text-red-500">*</span></label>
                <input
                  id='email'
                  className="flex items-center justify-center h-[50px] px-3 py-2 w-full bg-[#232839] rounded-[5px] border-none text-white text-base leading-6 outline-none focus:outline-[#ff5c1b] "
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter') {
                      const isValid = await isEmailValid();
                      if (isValid) {
                        e.preventDefault();
                        document.getElementById("adminCode")?.focus();
                      }
                    }
                  }}
                />
                {errors.email && (
                  <span className="text-[#ff4d4d] text-xs mt-1">{errors.email}</span>
                )}
              </div>


              <div className="flex flex-col items-start gap-2 w-full">
                <label className="w-full text-[#d5dfff] text-base leading-6">Admin Verification Code <span className="text-red-500">*</span></label>
                <div className="flex h-[50px] items-center gap-1.5 px-3 py-2 w-full bg-[#232839] rounded-[5px] focus-within:outline focus-within:outline-[#ff5c1b] ">
                  <input
                    id='adminCode'
                    type={showAdminCode ? "text" : "password"}
                    className="bg-transparent border-none outline-none text-white text-base flex-1 transition-all duration-300"
                    placeholder="Enter admin code"
                    value={formData.adminCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, adminCode: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setErrors(prev => ({ ...prev, adminCode: "" }));
                      if (!formData.adminCode) {
                        setErrors(prev => ({ ...prev, adminCode: "Admin code is required." }));
                        return;
                      }
                        e.preventDefault();
                        document.getElementById("password")?.focus();
                      }
                    }}
                  />
                  <div className="relative inline-block cursor-pointer" onClick={toggleAdminCode}>
                    <img
                      className="w-5 h-5 hover:scale-110 hover:opacity-80 transition-transform duration-200"
                      src={!showAdminCode ? eyeIcon : eyeSlachIcon}
                      alt="Toggle admin code"
                    />
                  </div>
                </div>
                {errors.adminCode && (
                  <span className="text-[#ff4d4d] text-xs mt-1">{errors.adminCode}</span>
                )}
              </div>

              <div className="flex flex-col items-start gap-2 w-full">
                <label className="w-full text-[#d5dfff] text-base leading-6">Password <span className="text-red-500">*</span></label>
                <div className="flex h-[50px] items-center gap-1.5 px-3 py-2 w-full bg-[#232839] rounded-[5px] focus-within:outline focus-within:outline-[#ff5c1b] ">
                  <input
                    id='password'
                    type={showPassword ? "text" : "password"}
                    className="bg-transparent border-none outline-none text-white text-base flex-1 transition-all duration-300  "
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setErrors(prev => ({ ...prev, password: "" }));
                      if (!formData.password) {
                        setErrors(prev => ({ ...prev, password: "Admin code is required." }));
                        return;
                      }else if (formData.password.length < 8) {
                        setErrors(prev => ({ ...prev, password: "Password must be at least 8 characters."  }));
                        return;
                      }
                        e.preventDefault();
                        document.getElementById("password")?.focus();
                      }
                    }}
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
              {errors.password && (
                <span className="text-[#ff4d4d] text-xs mt-1">{errors.password}</span>
              )}
            </div>

            <button
              type="button"
              onClick={handleSignUp}
              className="flex items-center justify-center gap-2 px-8 py-4 w-full bg-[#db4402] rounded-md min-h-[56px] hover:bg-[#e05206] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] active:scale-98 active:shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
            >
              <span className="text-white text-base leading-6 font-bold whitespace-nowrap">Register as staff</span>
            </button>

            <div className="w-full text-center text-[#d5dfff] text-base leading-6">
              <span className="font-medium">Already have an account?</span>
              <span>&nbsp;</span>
              <Link to="/sign-in" className="font-bold text-[#db4402] hover:text-[#ff5c1b] transition-colors duration-300">Login</Link>
            </div>
          </form>
        </div>
        <div
          className="h-full w-full bg-cover bg-center hidden lg:block"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        ></div>
      </div>
    </div>
  );
};

export default SignUpStaff;