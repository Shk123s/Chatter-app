import React, { useContext, useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './sideNavbar.css';
import MyContext from "./context/MyContext";
import { HashLoader } from 'react-spinners';

export default function SideNavbar() {
  const [load, setLoader] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(MyContext);

  const handleLogout = async () => {
    setLoader(true); // Set loader to true when logout starts
    try {
      const response = await axios.post("http://localhost:8000/api/logout", {}, { withCredentials: true });

      if (response.status === 200) {
        localStorage.removeItem('token');
        navigate('/'); 
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoader(false); // Reset loader after logout attempt finishes
    }
  };

  return (
    <div className="container">
      <div onClick={handleLogout} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        {load ? (
          <div className="loader"><HashLoader color="#0094ff" size={40} /></div> 
        ) : (
          <BiLogOut size={'40px'} />
        )}
      </div>
      <div className="avatar">
        <IoSettingsOutline size={'30px'} />
        <img src={user?.avatar} alt="avatar" />
      </div>
    </div>
  );
}
