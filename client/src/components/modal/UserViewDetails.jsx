import React, { useState, useEffect } from 'react';
import { FaRegWindowClose } from 'react-icons/fa';
import UserCard from '../UserCard';
import { IoIosRemoveCircleOutline } from "react-icons/io";
import axios from 'axios';
import { toast } from 'react-toastify';

const UserViewDetails = ({ currentUser, closeModal }) => {
  const [members, setMembers] = useState(currentUser?.memberDetails || []);

  const fetchData = async () => {
    try {
      const getData = await axios.get("http://localhost:8000/api/getConversation", {
        withCredentials: true,
      });
      console.log(getData.data.message, "fetched member data");
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load member details.", { position: "bottom-left" });
    }
  };

  const handleRemoveMember = async (contact) => {
    try {
      const removeMember = await axios.post(
        `http://localhost:8000/api/removeGroupMembers/${currentUser._id}`,
        { members: contact._id },
        { withCredentials: true }
      );

      if (removeMember.status === 200) {
        toast.success("Member Removed!", { position: "bottom-left" });
        setMembers(prevMembers => prevMembers.filter(member => member._id !== contact._id));
        fetchData();
        closeModal();
        window.location.reload();  // Refreshes the page after closing the modal
      }
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("An error occurred while removing the member.", { position: "bottom-left" });
      if (error.response && error.response.status === 400) {
        toast.warn("Not an admin", { position: "bottom-left" });
      }
    }
  };

  return (
    <div className='modal'>
      <div className="modal-content">
        <FaRegWindowClose
          type="button"
          size={"35px"}
          onClick={() => {
            closeModal();
            window.location.reload();
          }}
          style={{ cursor: 'pointer', borderRadius: "5px" }}
        />

        {members.length > 0 ? (
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
        )}
      </div>
    </div>
  );
};

export default UserViewDetails;
