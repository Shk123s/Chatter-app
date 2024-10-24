import React, { useContext } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './sideNavbar.css';
import MyContext from "./context/MyContext";

export default function SideNavbar() {
  const navigate = useNavigate();
  const { user} = useContext(MyContext);
  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/logout",{},
      {withCredentials:true});
  
      if (response.status === 200) {
        localStorage.removeItem('token');
        navigate('/'); 
      }
    } catch (error) {
      console.error("Logout failed:", error);

    }
  };

  return (
    <div className="container">
      <div onClick={handleLogout} style={{ cursor: 'pointer' }}>
        <BiLogOut size={'40px'} />
      </div>
      <div className="avatar" />
      <div className="avatar">
        <IoSettingsOutline size={'30px'} />
        <img
          src={user?.avatar}
          alt="avatar"
        />
      </div>
    </div>
  );
}
