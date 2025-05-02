import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import eye from '../assets/eye.png';
import eyeSlash from '../assets/eye-slash.png';
import logo from '../assets/logo.png';
export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    if (!username || !password) {
      alert("Please fill in both username and password.");
      return;
    }
    login();
  };

  useEffect(() => {
    // Auto-login if token exists
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token && user?.role === "MEMBER") {
      navigate("/member/Dashboard");
    }
  }, [navigate]);

  const login = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Login failed: ${response.status} - ${errorText}`);
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
      console.error("Error:", error.message);
    }
  };

  return (
     <div className="sign-in bg-[#101624] flex flex-col justify-center w-full h-screen overflow-hidden">
      <div className="overlap-group-wrapper w-[1440px] h-[952px] bg-[#101624] mx-auto">
        <div
          className="overlap-group relative h-[952px]"
          style={{ backgroundImage: "url(/assets/images/Noise.png)", backgroundSize: "100% 100%" }}
        >
          <div
            className="overlap absolute top-0 left-0 w-[740px] h-full"
            style={{ backgroundImage: "url(/assets/images/EXPORT-BG.png)", backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <div className="form flex flex-col w-[566px] gap-9 p-[60px_40px] absolute top-[141px] left-[87px] rounded-[20px] shadow-[0px_0px_70px_#00000033] bg-gradient-to-b from-[#12141d] to-[#12151f]">
              
              {/* Header */}
              <header className="header flex flex-col gap-8 w-full">
                {/* Logo and Title */}
                <div className="frame inline-flex items-center gap-2">
                  <img className="logo w-[60px] h-[62px]" src={logo} alt="Logo" />
                  <p className="book-FSEI text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-orange-600">
                    <span className="text-white">Book</span>
                    <span className="text-[#db4402]">FSEI</span>
                  </p>
                </div>

                {/* Welcome Text */}
                <div className="option flex flex-col gap-3 w-full">
                  <p className="welcome-back-to-the text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-orange-600">
                    <span className="text-white">Welcome Back to the Book</span> <span className="text-[#db4402]">FSEI</span>
                  </p>
                  <p className="text-gray-300 text-lg">
                    Access the vast collection of resources, and stay updated
                  </p>
                </div>
              </header>

              {/* Form Content */}
              <div className="sign-in-content flex flex-col gap-4 w-full">
                <div className="info flex flex-col gap-5 w-full">
                  
                  {/* Email Field */}
                  <div className="div-2 flex flex-col gap-2 w-full">
                    <label className="text-gray-300 text-base">Email</label>
                    <input
                      className="input h-[56px] px-5 bg-[#232839] rounded-[5px] text-white text-base outline-none"
                      placeholder="firstname.second@etu.univ-mosta.dz"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>

                  {/* Password Field */}
                  <div className="div-2 flex flex-col gap-2 w-full">
                    <label className="text-gray-300 text-base">Password</label>
                    <div className="input-2 flex items-center gap-2 h-[56px] px-5 bg-[#232839] rounded-[5px]">
                      <input
                        className="password-input flex-1 bg-transparent text-white text-base outline-none"
                        placeholder="At least 8 characters"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <div className="tooltip-container relative cursor-pointer" onClick={togglePassword}>
                        <img
                          className="eye w-5 h-5"
                          src={showPassword ? eyeSlash : eye}
                          alt="Toggle Password"
                        />
                        <span className="tooltip-text absolute bottom-full mb-2 hidden group-hover:block text-xs bg-black text-white p-1 rounded">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Login Button */}
              <button
                onClick={handleLogin}
                className="button flex justify-center items-center bg-[#db4402] hover:bg-orange-700 rounded-[6px] min-h-[56px] w-full"
              >
                <div className="button-now font-bold text-white text-lg">
                  Login
                </div>
              </button>

              {/* Register Link */}
              <p className="don-t-have-an text-center text-sm text-gray-400 mt-4">
                Don’t have an account already?{" "}
                <Link to="/sign-up" className="text-[#db4402] hover:underline">
                  Register here
                </Link>
              </p>

            </div>
          </div>

          {/* Right Side Image */}
          <img
            className="image absolute right-0 top-0 w-[700px] h-full object-cover"
            src="/assets/images/image-14.jpg"
            alt="Bookshelf"
          />
        </div>
      </div>
    </div>
  );
}