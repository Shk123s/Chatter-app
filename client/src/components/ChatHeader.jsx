import React, { useEffect, useState } from "react";
import { CiVideoOn } from "react-icons/ci";
import { IoCallOutline } from "react-icons/io5";
import { IoSearchSharp } from "react-icons/io5";
import { GrView } from "react-icons/gr";
import "./chatbox.css";
import UserViewDetails from "./modal/UserViewDetails";


export const ChatHeader = ({currentUser}) => { 
  const [UserViewDetailsModal, setUserViewDetailsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(currentUser)
if (loading) return <div className="contacts-container">Loading...</div>; 
  return (
    <div className="chat-header-container">
      <div className="chat-avatar-name">
        <img src={currentUser?.memberDetails[0]?.avatar || currentUser?.groupAvatar} />
        <div className="header-name">
          <p>{currentUser?.memberDetails[0]?.username || currentUser?.name}</p>
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
      { UserViewDetailsModal && <UserViewDetails currentUser={currentUser} closeModal={()=> setUserViewDetailsModal(false)}/> }  
        <GrView  size={'30px'}   onClick={ ()=>setUserViewDetailsModal(true)}/>
      </div>
    </div>
  );
};
