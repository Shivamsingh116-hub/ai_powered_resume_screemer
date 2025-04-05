import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import Modal from "../Modal";
import { Context } from "../common/Context";
import LogoutIcon from '@mui/icons-material/Logout';
const navItem = [
  { path: "/", label: "Home" },
  { path: "/jobdescription", label: "Job Description" },
  { path: "/results", label: "Results" },
  { path: "/dashboard", label: "Dashboard" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { popupModal, message, currentUser, setPopupModal, setCurrentUser, fetchResume } = useContext(Context)
  const navigate = useNavigate()
  const location = useLocation()
  const handleSignin = () => {
    fetchResume()
    navigate("/signin");
  }
  const handleLogout = () => {
    localStorage.removeItem("token")
    setCurrentUser(null)
    fetchResume()
    navigate("/signin")
  }
  useEffect(() => {
    const menuHandle = () => {
      setIsOpen(false)
    }
    menuHandle()
  }, [location.pathname])
  return (
    <nav className="p-5 flex justify-between  items-center border-b-2 border-gray-400 bg-white">
      {/* Logo or Title */}
      <h1 className="text-xl font-bold md:hidden">Resume Screener</h1>

      {/* Menu Items */}
      <ul
        className={`flex items-center md:flex-row flex-col gap-2 md:gap-0 md:space-x-6 absolute md:static top-16 left-0 h-full w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none p-4 pt-0 md:p-0 transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        {navItem.map((item, index) => (
          <li onClick={()=>setIsOpen(false)} key={index} className="text-lg hover:cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105">
            <Link className="hover:font-medium text-gray-800" to={item.path}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Menu Button for Mobile */}
      <div>
        {currentUser ? <button onClick={handleLogout} className="p-2"><LogoutIcon /></button> : <button onClick={handleSignin} className="px-2 border">Signin</button>}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
          <MenuIcon />
        </button>
      </div>
      {popupModal && <Modal message={message} onClose={() => setPopupModal(false)} duration={3000} />}
      
    </nav>
  );
};

export default Navbar;
