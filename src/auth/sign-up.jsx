import React, { useState } from 'react';
import logo from '../assets/logo.png';
import eyeIcon from '../assets/eye.png';
import eyeSlachIcon from '../assets/eye-slash.png';
import documentUploadIcon from '../assets//document-upload.png';
import backgroundImage from '../assets/image-14.jpg';
import noiseBackground from '../assets/Noise.png';
import exportBg from '../assets/EXPORT-BG.png';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    identifier: ""
  })
  

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  const handleSignUp = () => {
      if (!formData.email || !formData.password || !formData.fullName) {
        alert("Please fill in both username and password.");
        return;
      }
      signup();
    };

  const signup = async() => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          username: formData.email,
          email: formData.email,
          password: formData.password,
          identifier: formData.identifier,
          role: "member"
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`register failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log(data);
  

      if (data && data.role =="MEMBER") {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/member/Dashboard");
      } else if (data.role =="STAFF") {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/staff/dashboard");
      } else {
        console.error("Invalid role or missing token");
      }
      
    } catch (error) {
      
    }
  }



  return (
    <div className="bg-[#101624] flex flex-col justify-center w-full">
      <div className="w-[1440px] mx-auto">
        <div 
          className="relative h-[1000px] bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${noiseBackground})` }}
        >
          <div 
            className="absolute w-[740px] h-[1000px] top-0 left-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${exportBg})` }}
          >
            <div className="flex flex-col rounded-[20px] w-[566px] items-start gap-[2%] p-[3%_2%] absolute top-[15%] left-[12%] shadow-[0px_0px_70px_0px_rgba(0,0,0,0.2)] bg-gradient-to-b from-[#12141d] to-[#12151f]">
              <header className="flex flex-col items-start gap-4 w-full">
                <div className="inline-flex items-center gap-1.5">
                  <img className="w-[60px] h-[62px]" src={logo} alt="Logo" />
                  <p className="text-[28px] leading-6 font-semibold">
                    <span className="text-white">Book</span>
                    <span className="text-[#db4402]">FSEI</span>
                  </p>
                </div>
                <div className="flex flex-col items-start gap-2 w-full">
                  <p className="w-full text-[28px] leading-[30px] font-semibold text-white">
                    Create Your Library Account
                  </p>
                  <p className="w-full text-[#d5dfff] text-[18px] leading-5 mb-5">
                    Please complete all fields and upload a valid university ID to gain access to the Library.
                  </p>
                </div>
              </header>

              <form id="sign-up-form" className="flex flex-col items-start gap-4 w-full" onSubmit={()=>{}}>
                <div className="flex flex-col items-start gap-5 w-full">
                  <div className="flex flex-col items-start gap-2 w-full">
                    <label className="w-full text-[#d5dfff] text-base leading-6">Full Name</label>
                    <input
                      className="flex items-center justify-center h-[50px] px-5 py-2.5 w-full bg-[#232839] rounded-[5px] border-none text-white text-base leading-6 outline-none"
                      id="full-name"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e)=>{setFormData(prev => ({...prev, fullName: e.target.value}))}}
                    />
                    {/* {errors.fullName && (
                      <span className="text-[#ff4d4d] text-xs mt-1">{errors.fullName}</span>
                    )} */}
                  </div>
                  <div className="flex flex-col items-start gap-2 w-full">
                    <label className="w-full text-[#d5dfff] text-base leading-6">Email</label>
                    <input
                      className="flex items-center justify-center h-[50px] px-5 py-2.5 w-full bg-[#232839] rounded-[5px] border-none text-white text-base leading-6 outline-none"
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e)=>{setFormData(prev => ({...prev, email: e.target.value}))}}
                    />
                    {/* {errors.email && (
                      <span className="text-[#ff4d4d] text-xs mt-1">{"errors.email"}</span>
                    )} */}
                  </div>
                  <div className="flex flex-col items-start gap-2 w-full">
                    <label className="w-full text-[#d5dfff] text-base leading-6">Identifier</label>
                    <input
                      className="flex items-center justify-center h-[50px] px-5 py-2.5 w-full bg-[#232839] rounded-[5px] border-none text-white text-base leading-6 outline-none"
                      type="text"
                      name="universityId"
                      placeholder="e.g., 322345575412"
                      value={formData.identifier}
                      onChange={(e)=>{setFormData(prev => ({...prev, identifier: e.target.value}))}}
                      
                    />
                  </div>
                  <div className="flex flex-col items-start gap-2 w-full">
                    <label className="w-full text-[#d5dfff] text-base leading-6">Password</label>
                    <div className="flex h-[50px] items-center gap-1.5 px-5 py-2.5 w-full bg-[#232839] rounded-[5px]">
                      <input
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
                  <div className="flex flex-col items-start gap-2 w-full">
                    <label className="w-full text-[#d5dfff] text-base leading-6">Upload University ID Card</label>
                    <div className="flex items-center justify-center h-[50px] px-5 py-2.5 w-full bg-[#232839] rounded-[5px] border-none text-white text-base leading-6 outline-none gap-2.5 cursor-pointer">
                      <img className="w-5 h-5" src={documentUploadIcon} alt="Upload" />
                      <label htmlFor="file-upload" className="cursor-pointer">Upload a file</label>
                      <input
                        id="file-upload"
                        name="file"
                        type="file"
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              
                <button
                  type="button"
                  onClick={handleSignUp}
                  className="flex items-center justify-center gap-1.5 px-8 py-4 w-full bg-[#db4402] rounded-[6px] min-h-[56px] hover:bg-[#e05206] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] active:scale-98 active:shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
                >
                  <div className="text-white text-base leading-6 font-bold whitespace-nowrap">Sign Up</div>
                </button>
                <div className="w-full text-center text-[#d5dfff] text-base leading-6">
                  <span className="font-medium">Have an account already?</span>
                  <span>&nbsp;</span>
                  <Link to="/sign-in" className="font-bold text-[#db4402] hover:text-[#ff5c1b] transition-colors duration-300">Login</Link>
                </div>
              </form>
            </div>
          </div>
          <img className="absolute w-[700px] h-full top-0 left-[740px] object-cover" src={backgroundImage} alt="Background" />
        </div>
      </div>
    </div>
  );
};

export default SignUp;