import React, { useEffect, useState } from "react";
import { CiVideoOn } from "react-icons/ci";
import { IoCallOutline } from "react-icons/io5";
import { IoSearchSharp } from "react-icons/io5";
import "./chatbox.css";
import axios from "axios";


export const ChatHeader = ({currentUser}) => { 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const getData = await axios.get("http://localhost:5000/api/getUser/66f26695c44e662f145666ac");

//       setData(getData.data.user);
//     } catch (error) {
//       console.log(error)
//       setLoading(true);
//     }
//   };
//   fetchData();
//   return () => {};
// }, []);

if (loading) return <div className="contacts-container">Loading...</div>; 
  return (
    <div className="chat-header-container">
      <div className="chat-avatar-name">
        <img src={currentUser.avatar} />
        <div className="header-name">
          <p>{currentUser.username}</p>
          <span>Online</span>
        </div>
      </div>
      <div className="call-search-maincontainer">
        <div className="call-container">
          <div className="video-call">
            <CiVideoOn size={"35px"} />
          </div>
          <div className="call">
            <IoCallOutline size={"28px"} />
          </div>
        </div>
        <IoSearchSharp  size={'30px'} />
      </div>
    </div>
  );
};
