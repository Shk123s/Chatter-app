import React, { useState, useEffect } from 'react';
import { FaRegWindowClose } from 'react-icons/fa';
import UserCard from '../UserCard';
import { IoIosRemoveCircleOutline } from "react-icons/io";
import axios from 'axios';
import { FaRegEdit } from "react-icons/fa";
import { toast } from 'react-toastify';

const UserViewDetails = ({ currentUser, closeModal }) => {
  const [members, setMembers] = useState(currentUser?.memberDetails || []);
  const fetchData = async () => {
    try {
      const getData = await axios.get("http://localhost:8000/api/getConversation", {
        withCredentials: true,
      });
    
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load member details.", { position: "bottom-left" });
    }
  };

  const handleRemoveMember = async (contact) => {
    try {
      console.log(currentUser)
      const removeMember = await axios.post(
        `http://localhost:8000/api/removeGroupMembers/${currentUser.chatId}`,
        { members: contact._id },
        { withCredentials: true }
      );

      if (removeMember.status === 200) {
        toast.success("Member Removed!", { position: "bottom-left" });
        setMembers(prevMembers => prevMembers.filter(member => member._id !== contact._id));
        fetchData();
        closeModal();
        window.location.reload();
      }
    } catch (error) {
      console.error("Error removing member:", error);
      if (error.response && error.response.status === 400) {
        toast.warn("Not an admin", { position: "bottom-left" });
      }else{
        toast.error("An error occurred while removing the member.", { position: "bottom-left" });
      }
    }
  };

  return (
    <div className='modal'>
  <div className="modal-content">
    <FaRegEdit  size={"35px"} style={{ cursor: 'pointer', borderRadius: "5px",marginRight:"25px",float:"right" }} 
    /> 
    <p style={{ marginTop:"10px",marginRight:"10px",float:"right" }}>Group Name </p>

    <FaRegWindowClose
      type="button"
      size={"35px"}
      onClick={() => {
        closeModal();
        window.location.reload();
      }}
      style={{ cursor: 'pointer', borderRadius: "5px" }}
    />
    {
      currentUser?.groupChat === false ? (
      <UserCard  style={{ marginLeft: '25px', display: "flex", alignItems: 'center',}}
        username={currentUser?.username}
        avatar={currentUser?.avatar}
        message={currentUser?.bio}
      />
    ) : (
      members.length > 0 ? (
        members.map((contact) => (
          <div key={contact._id} style={{ marginLeft: '45px', display: "flex", alignItems: 'center', gap: "5px" }}>
            <UserCard
              username={contact.username}
              avatar={contact.avatar}
              message={contact.bio}
            />
            <IoIosRemoveCircleOutline
              size={"35px"}
              onClick={() => handleRemoveMember(contact)}
              style={{ color: 'green', cursor: 'pointer' }}
            />
          </div>
        ))
      ) : (
        <p>No member details available.</p>
      )
    )}
  </div>
</div>
  );
};

export default UserViewDetails;
