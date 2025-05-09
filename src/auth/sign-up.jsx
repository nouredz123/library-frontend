import React, { useState } from 'react';
import logo from '../assets/logo.png';
import eyeIcon from '../assets/eye.png';
import eyeSlachIcon from '../assets/eye-slash.png';
import documentUploadIcon from '../assets//document-upload.png';
import backgroundImage from '../assets/image-14.jpg';
import noiseBackground from '../assets/Noise.png';
import exportBg from '../assets/EXPORT-BG.png';
import { Link, useNavigate } from 'react-router-dom';
import { Opacity } from '@mui/icons-material';

const algerianWilayas = [
  "1 - Adrar", "2 - Chlef", "3 - Laghouat", "4 - Oum El Bouaghi", "5 - Batna",
  "6 - Béjaïa", "7 - Biskra", "8 - Béchar", "9 - Blida", "10 - Bouira",
  "11 - Tamanrasset", "12 - Tébessa", "13 - Tlemcen", "14 - Tiaret", "15 - Tizi Ouzou",
  "16 - Alger", "17 - Djelfa", "18 - Jijel", "19 - Sétif", "20 - Saïda",
  "21 - Skikda", "22 - Sidi Bel Abbès", "23 - Annaba", "24 - Guelma", "25 - Constantine",
  "26 - Médéa", "27 - Mostaganem", "28 - M'Sila", "29 - Mascara", "30 - Ouargla",
  "31 - Oran", "32 - El Bayadh", "33 - Illizi", "34 - Bordj Bou Arréridj", "35 - Boumerdès",
  "36 - El Tarf", "37 - Tindouf", "38 - Tissemsilt", "39 - El Oued", "40 - Khenchela",
  "41 - Souk Ahras", "42 - Tipaza", "43 - Mila", "44 - Aïn Defla", "45 - Naâma",
  "46 - Aïn Témouchent", "47 - Ghardaïa", "48 - Relizane", "49 - Timimoun", "50 - Bordj Badji Mokhtar",
  "51 - Ouled Djellal", "52 - Béni Abbès", "53 - In Salah", "54 - In Guezzam", "55 - Touggourt",
  "56 - Djanet", "57 - El M'Ghair", "58 - El Meniaa"
];

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    identifier: "",
    dateOfBirth: "",
    major: "",
    wilaya: "",
    cardBase64: "",
    cardContentType: ""
  })
  

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        cardBase64: reader.result.split(',')[1], // extract base64 string
        cardContentType: file.type,              // e.g., image/png or image/jpeg
      }));
    };
    reader.readAsDataURL(file);
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
          role: "member",
          cardBase64: formData.cardBase64
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`register failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log(data);
      setFormData({
        email: "",
        password: "",
        fullName: "",
        identifier: "",
        cardBase64: ""
      })
  

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
    <div className="relative bg-[rgb(16,22,36)] flex flex-col justify-center w-full bg-cover" style={{ backgroundImage: `url(${exportBg})` }}>
      <div className='absolute inset-0 bg-cover bg-center opacity-25' style={{ backgroundImage: `url(${noiseBackground})`}}></div>
      <div className=" w-full grid grid-cols-2 gap-16 z-10">
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
                Create Your Library Account
              </p>
              <p className="w-full text-[#d5dfff] text-[18px] leading-5 mb-5">
                Please complete all fields and upload a valid university ID to gain access to the Library.
              </p>
            </div>
          </header>

          <form id="sign-up-form" className="flex flex-col items-start gap-4 w-full" onSubmit={()=>{}}>
            <div className="flex flex-col items-start gap-5 w-full py-2">

              <div className="flex flex-col items-start gap-2 w-full">
                <label className="w-full text-[#d5dfff] text-base leading-6">Full Name</label>
                <input
                  className="flex items-center justify-center h-[50px] px-3 py-2 w-full bg-[#232839] rounded-[5px] border-none text-white text-base leading-6 outline-none"
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
                  className="flex items-center justify-center h-[50px] px-3 py-2 w-full bg-[#232839] rounded-[5px] border-none text-white text-base leading-6 outline-none"
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
                <label className="w-full text-[#d5dfff] text-base leading-6">Date of birth</label>
                <div className="relative w-full">
                  <input
                    className="flex items-center h-[50px] px-3 py-2 w-full bg-[#232839] rounded-[5px] border-none text-white text-base leading-6 outline-none appearance-none cursor-pointer"
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={(e)=>{setFormData(prev => ({...prev, dateOfBirth: e.target.value}))}}
                    style={{
                      colorScheme: 'dark',
                      '::WebkitCalendarPickerIndicator': {
                        filter: 'invert(1)',
                        cursor: 'pointer'
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col items-start gap-2 w-full">
                <label className="w-full text-[#d5dfff] text-base leading-6">Major</label>
                <select
                  className="flex items-center justify-center h-[50px] px-3 py-2 w-full bg-[#232839] rounded-[5px] border-none text-white text-base leading-6 outline-none"
                  name="major"
                  value={formData.major}
                  onChange={(e)=>{setFormData(prev => ({...prev, major: e.target.value}))}}
                >
                  <option value="" disabled >Select your major</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Physics">Physics</option>
                </select>
              </div>

              <div className="flex flex-col items-start gap-2 w-full">
                <label className="w-full text-[#d5dfff] text-base leading-6">Wilaya</label>
                <select
                  className="flex items-center justify-center h-[50px] px-3 py-2 w-full bg-[#232839] rounded-[5px] border-none text-white text-base leading-6 outline-none"
                  name="wilaya"
                  value={formData.wilaya}
                  onChange={(e)=>{setFormData(prev => ({...prev, wilaya: e.target.value}))}}
                >
                  <option value="" disabled>Select your wilaya</option>
                  {algerianWilayas.map((wilaya, index) => (
                    <option key={index} value={wilaya}>{wilaya}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex flex-col items-start gap-2 w-full">
                <label className="w-full text-[#d5dfff] text-base leading-6">Identifier</label>
                <input
                  className="flex items-center justify-center h-[50px] px-3 py-2 w-full bg-[#232839] rounded-[5px] border-none text-white text-base leading-6 outline-none"
                  type="text"
                  name="universityId"
                  placeholder="e.g., 322345575412"
                  value={formData.identifier}
                  onChange={(e)=>{setFormData(prev => ({...prev, identifier: e.target.value}))}}
                  
                />
              </div>

              <div className="flex flex-col items-start gap-2 w-full">
                <label className="w-full text-[#d5dfff] text-base leading-6">Password</label>
                <div className="flex h-[50px] items-center gap-1.5 px-3 py-2 w-full bg-[#232839] rounded-[5px]">
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
                <div className="flex items-center justify-center h-[50px] px-3 py-2 w-full bg-[#232839] rounded-[5px] border-none text-white text-base leading-6 outline-none gap-2.5 cursor-pointer">
                  <img className="w-5 h-5" src={documentUploadIcon} alt="Upload" />
                  <label htmlFor="file-upload" className="cursor-pointer">Upload a file</label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                    className="absolute opacity-0 w-0 h-0"
                  />
                </div>
              </div>
            </div>
          
            <button
              type="button"
              onClick={handleSignUp}
              className="flex items-center justify-center gap-2 px-8 py-4 w-full bg-[#db4402] rounded-md min-h-[56px] hover:bg-[#e05206] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] active:scale-98 active:shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
            >
              <span className="text-white text-base leading-6 font-bold whitespace-nowrap">Sign Up</span>
            </button>
            <div className="w-full text-center text-[#d5dfff] text-base leading-6">
              <span className="font-medium">Have an account already?</span>
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

export default SignUp;