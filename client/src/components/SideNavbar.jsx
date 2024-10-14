import React from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './sideNavbar.css';

export default function SideNavbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/logout");
 
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
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOuxrvcNMfGLh73uKP1QqYpKoCB0JLXiBMvA&s"
          alt="avatar"
        />
      </div>
    </div>
  );
}
